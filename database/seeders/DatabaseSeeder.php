<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\GarmetType;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // USERS
        $admin = User::factory()->create([
            'name'  => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $manager = User::factory()->create([
            'name'  => 'Cashier User',
            'email' => 'manager@example.com',
        ]);

        $staff = User::factory()->create([
            'name'  => 'Cashier User',
            'email' => 'staff@example.com',
        ]);


        // CUSTOMERS
        Customer::factory()->count(5)->create();


        // GARMET TYPES PRICELIST (from your data)
        $garments = [
            ['Blazer', 'per_piece', 400],
            ['Jacket /Trench Coat', 'per_piece', 400],
            ['Graduation Gown', 'per_piece', 1000],
            ['Suit (Blazer @ Trouser)', 'per_piece', 500],
            ['Socks', 'per_piece', 100],
            ['Shirt/Blouse', 'per_piece', 150],
            ['Official Trouser', 'per_piece', 200],

            ['Duvets 4*6 /Kids', 'per_piece', 500],
            ['Duvet 6*6/5*6', 'per_piece', 1000],
            ['Throw Blanket', 'per_piece', 400],
            ['Normal Blanket', 'per_piece', 600],
            ['Bedsheets /White/Coloured', 'per_piece', 300],
            ['Small Towel', 'per_piece', 200],
            ['Large Towel', 'per_piece', 300],
            ['Pillows', 'per_piece', 300],
            ['Mattress Cover', 'per_piece', 300],

            ['Bras /Panties/Boxers', 'per_piece', 200],

            ['Sheers', 'per_piece', 200],
            ['Curtains', 'per_kg', 300],
            ['Teddy Bear (Small)', 'per_piece', 300],
            ['Teddy Bear (Big)', 'per_piece', 400],
        ];

        foreach ($garments as $g) {
            GarmetType::create([
                'name' => $g[0],
                'default_pricing_mode' => $g[1],
                'default_price' => $g[2],
            ]);
        }

        // // SETTINGS
        Setting::create([
            'key' => 'company_name',
            'value' => 'Wosh Laundry Ltd'
        ]);

        Setting::create([
            'key' => 'company_phone',
            'value' => '0116534908'
        ]);

        // ---------------------------------------------
        // CONFIGURATION ROLES
        // ---------------------------------------------

        // ROLES
        $adminRoleId   = DB::table('roles')->insertGetId(['name' => 'admin']);
        $managerRoleId = DB::table('roles')->insertGetId(['name' => 'manager']);
        $staffRoleId   = DB::table('roles')->insertGetId(['name' => 'staff']);

        // MODELS & ACTIONS
        $models = [
            'users',
            'branches',
            'customers',
            'orders',
            'order_items',
            'payments',
            'invoices',
            'settings',
        ];
        $actions = ['create', 'read', 'update', 'delete', 'attach_permission', 'detach_permission'];

        // CREATE PERMISSIONS
        $permissionIds = [];
        foreach ($models as $model) {
            foreach ($actions as $action) {
                $permissionIds[] = DB::table('permissions')->insertGetId([
                    'name' => "$model.$action"
                ]);
            }
        }

        // ADMIN → ALL permissions
        foreach ($permissionIds as $pid) {
            DB::table('role_permission')->insert([
                'role_id' => $adminRoleId,
                'permission_id' => $pid
            ]);
        }

        // MANAGER → basic operational permissions (customers, orders, order_items, payments, invoices)
        $managerModels = ['customers', 'orders', 'order_items', 'payments', 'invoices'];
        foreach ($managerModels as $model) {
            foreach (['create', 'read', 'update'] as $action) {
                $pid = DB::table('permissions')->where('name', "$model.$action")->value('id');
                DB::table('role_permission')->insert([
                    'role_id' => $managerRoleId,
                    'permission_id' => $pid
                ]);
            }
        }

        // STAFF → only orders.read + order_items.read/update
        $staffPermissions = [
            'orders.read',
            'orders.create',
            'order_items.read',
            'order_items.update'
        ];
        foreach ($staffPermissions as $perm) {
            $pid = DB::table('permissions')->where('name', $perm)->value('id');
            DB::table('role_permission')->insert([
                'role_id' => $staffRoleId,
                'permission_id' => $pid
            ]);
        }

        // ATTACH USERS TO ROLES
        DB::table('user_role')->insert([
            ['user_id' => $admin->id, 'role_id' => $adminRoleId],
            ['user_id' => $manager->id, 'role_id' => $managerRoleId],
            ['user_id' => $staff->id, 'role_id' => $staffRoleId],
        ]);


        // ---------------------------------------------
        // CUSTOMERS
        // ---------------------------------------------
        $customers = Customer::factory()->count(20)->create();

        // ---------------------------------------------
        // CONFIGURATION MAPS
        // ---------------------------------------------
        $garmentPrices = [
            'shirt' => 150,
            'pants' => 200,
            'jacket' => 500,
            'dress' => 450,
            'suit' => 1200,
            'socks' => 50,
            'coat' => 800,
            'sweater' => 300,
            'other' => 250
        ];

        $materials = ['cotton', 'wool', 'synthetic', 'delicate'];

        // Define logical status flows
        $scenarios = [
            ['order' => 'completed',   'item' => 'completed',     'pay' => 'completed'],
            ['order' => 'ready',       'item' => 'ready',         'pay' => 'completed'],
            ['order' => 'in-progress', 'item' => 'washing',       'pay' => 'completed'],
            ['order' => 'pending',     'item' => 'pending',       'pay' => 'pending'],
            ['order' => 'pending',     'item' => 'pending',       'pay' => 'failed'], // M-Pesa bounce case
        ];

        // ---------------------------------------------
        // SEEDING LOGIC
        // ---------------------------------------------
        foreach (range(1, 40) as $i) {
            $customer = $customers->random();
            $scenario = collect($scenarios)->random();

            // 1. Create Order
            $order = Order::factory()->create([
                'user_id'     => $admin->id,
                'customer_id' => $customer->id,
                'status'      => $scenario['order'],
                'total_amount' => 0,
                'created_at'  => now()->subDays(rand(1, 15)),
            ]);

            $itemsTotal = 0;
            $itemCount  = rand(2, 6);

            // 2. Create Order Items (Status Sync)
            for ($j = 0; $j < $itemCount; $j++) {
                $garment     = array_rand($garmentPrices);
                $unitPrice   = $garmentPrices[$garment];
                $pricingMode = collect(['per_item', 'by_weight'])->random();
                $qty         = rand(1, 4);
                $weight      = ($pricingMode === 'by_weight') ? rand(1, 5) : null;

                $totalPrice = ($pricingMode === 'by_weight')
                    ? ($weight * $unitPrice)
                    : ($qty * $unitPrice);

                OrderItem::create([
                    'order_id'     => $order->id,
                    'garment_type' => $garment,
                    'material'     => collect($materials)->random(),
                    'pricing_mode' => $pricingMode,
                    'quantity'     => $qty,
                    'weight_kg'    => $weight,
                    'unit_price'   => $unitPrice,
                    'total_price'  => $totalPrice,
                    'status'       => $scenario['item'], // Synchronized with scenario
                ]);

                $itemsTotal += $totalPrice;
            }

            // 3. Update Order Final Total
            $order->update(['total_amount' => $itemsTotal]);

            // 4. Payment Creation (Realistic methods & Status)
            $method = collect(['cash', 'mpesa'])->random();

            Payment::create([
                'order_id'             => $order->id,
                'customer_id'          => $customer->id,
                'processed_by_user_id' => $staff->id,
                'amount'               => $itemsTotal,
                'method'               => $method,
                'status'               => $scenario['pay'],
                'mpesa_reference'      => ($method === 'mpesa') ? 'BK' . strtoupper(Str::random(8)) : null,
                'paid_at'              => ($scenario['pay'] === 'completed') ? now() : null,
            ]);

            // 5. Invoice Generation
            Invoice::factory()->create([
                'order_id' => $order->id,
                'customer_id' => $customer->id,
                'subtotal' => $itemsTotal,
                'total' => $itemsTotal,
                'sent_to_customer' => rand(0, 1),
            ]);
        }


        // ---------------------------------------------
        // LOST & DAMAGED ITEMS LOGS
        // ---------------------------------------------
        foreach (range(1, 5) as $i) {
            DB::table('garmet_handling_logs')->insert([
                'order_item_id' => Order::inRandomOrder()->first()->id,
                'stage' => collect(['lost', 'damaged'])->random(),
                'description' => 'Item issue reported during processing',
                'handled_by_user_id' => $staff->id,
                'scanned_at' => now()->subDays(rand(0, 5)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }


        // ---------------------------------------------
        // RECENT PAYMENTS (CLEAR FOR DASHBOARD DISPLAY)
        // ---------------------------------------------
        foreach (range(1, 10) as $i) {
            Payment::factory()->create([
                'amount' => rand(500, 5000),
                'method' => collect(['mpesa', 'cash', 'card'])->random(),
                'status' => collect(['success', 'pending'])->random(),
                'paid_at' => now()->subHours(rand(1, 48)),
                'customer_id' => $customers->random()->id,
                'processed_by_user_id' => $staff->id,
            ]);
        }
    }
}
