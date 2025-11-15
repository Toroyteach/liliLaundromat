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
            'role'  => 'admin',
        ]);

        $cashier = User::factory()->create([
            'name'  => 'Cashier User',
            'email' => 'cashier@example.com',
            'role'  => 'cashier',
        ]);


        // BRANCHES
        $branch1 = Branch::factory()->create([
            'name' => 'Main Branch',
            'location' => 'Evergreen Square off Kiambu Road',
            'phone' => '0116534908'
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


        // ORDERS
        $orders = Order::factory()->count(10)->create([
            'user_id' => $admin->id,
            'branch_id' => $branch1->id,
        ]);

        foreach ($orders as $order) {

            // ORDER ITEMS (2 each)
            OrderItem::factory()->count(2)->create([
                'order_id' => $order->id,
                'garment_type' => 'Shirt/Blouse',
                'pricing_mode' => 'per_piece',
                'quantity' => 2,
                'unit_price' => 150,
                'total_price' => 300,
                'status' => 'pending'
            ]);

            // payment
            Payment::factory()->create([
                'order_id' => $order->id,
                'customer_id' => $order->customer_id,
                'processed_by_user_id' => $cashier->id,
                'amount' => 300,
                'method' => 'cash',
                'status' => 'paid'
            ]);

            // invoice
            Invoice::factory()->create([
                'order_id' => $order->id,
                'customer_id' => $order->customer->id,
                'subtotal' => 300,
                'total' => 300,
                'sent_to_customer' => true
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

        // ROLES
        $adminRoleId   = DB::table('roles')->insertGetId(['name' => 'admin']);
        $cashierRoleId = DB::table('roles')->insertGetId(['name' => 'cashier']);
        $staffRoleId   = DB::table('roles')->insertGetId(['name' => 'staff']);

        // MODELS
        $models = [
            'users',
            'branches',
            'customers',
            'orders',
            'order_items',
            'payments',
            'invoices',
            'settings',
            'garmet_types',
        ];

        // PERMISSIONS
        $permissions = ['create', 'read', 'update', 'delete', 'attach_permission', 'detach_permission'];

        $permissionIds = [];

        foreach ($models as $model) {
            foreach ($permissions as $action) {
                $id = DB::table('permissions')->insertGetId([
                    'name' => "$model.$action"
                ]);
                $permissionIds[] = $id;
            }
        }

        // assign ALL permissions to admin
        foreach ($permissionIds as $pid) {
            DB::table('role_permission')->insert([
                'role_id' => $adminRoleId,
                'permission_id' => $pid
            ]);
        }

        // cashier → only for customers, orders, order_items, payments, invoices
        $cashierModels = ['customers', 'orders', 'order_items', 'payments', 'invoices'];

        foreach ($cashierModels as $model) {
            foreach (['create', 'read', 'update'] as $action) {
                $pid = DB::table('permissions')
                    ->where('name', "$model.$action")
                    ->value('id');

                DB::table('role_permission')->insert([
                    'role_id' => $cashierRoleId,
                    'permission_id' => $pid
                ]);
            }
        }

        // staff → only order_items.read + order_items.update
        foreach (['read', 'update'] as $action) {
            $pid = DB::table('permissions')
                ->where('name', "order_items.$action")
                ->value('id');

            DB::table('role_permission')->insert([
                'role_id' => $staffRoleId,
                'permission_id' => $pid
            ]);
        }

        // attach users to roles
        DB::table('user_role')->insert([
            ['user_id' => $admin->id, 'role_id' => $adminRoleId],
            ['user_id' => $cashier->id, 'role_id' => $cashierRoleId],
        ]);


        // Seeded data to the database
        // ---------------------------------------------
        // EXTRA CUSTOMERS FOR MORE REALISTIC DASHBOARD
        // ---------------------------------------------
        $customers = Customer::factory()->count(20)->create();


        // ---------------------------------------------
        // EXTRA ORDERS WITH DIFFERENT STATUSES
        // ---------------------------------------------
        $statuses = ['pending', 'in-progress', 'ready', 'completed'];

        foreach (range(1, 25) as $i) {

            $customer = $customers->random();

            $order = Order::factory()->create([
                'user_id'   => $admin->id,
                'branch_id' => $branch1->id,
                'customer_id' => $customer->id,
                'status'    => $statuses[array_rand($statuses)],
                'created_at' => now()->subDays(rand(0, 7)),
            ]);

            // ORDER ITEMS
            OrderItem::factory()->count(rand(1, 3))->create([
                'order_id' => $order->id,
                'garment_type' => 'Shirt/Blouse',
                'pricing_mode' => 'per_piece',
                'quantity' => rand(1, 5),
                'unit_price' => 150,
                'total_price' => 150 * rand(1, 5),
                'status' => 'done'
            ]);

            // PAYMENTS (mixed methods)
            Payment::factory()->create([
                'order_id' => $order->id,
                'customer_id' => $customer->id,
                'processed_by_user_id' => $cashier->id,
                'amount' => rand(300, 5000),
                'method' => collect(['cash', 'mpesa', 'card', 'invoice'])->random(),
                'status' => collect(['success', 'pending'])->random(),
                'paid_at' => now()->subDays(rand(0, 7)),
            ]);

            // INVOICES (some pending)
            Invoice::factory()->create([
                'order_id' => $order->id,
                'customer_id' => $customer->id,
                'subtotal' => rand(300, 5000),
                'total' => rand(300, 5000),
                'sent_to_customer' => rand(0, 1),
            ]);
        }


        // // ---------------------------------------------
        // // LOST & DAMAGED ITEMS LOGS
        // // ---------------------------------------------
        // foreach (range(1, 5) as $i) {
        //     DB::table('garmet_handling_logs')->insert([
        //         'order_item_id' => Order::inRandomOrder()->first()->id,
        //         'stage' => collect(['lost', 'damaged'])->random(),
        //         'description' => 'Item issue reported during processing',
        //         'handled_by_user_id' => $cashier->id,
        //         'scanned_at' => now()->subDays(rand(0, 5)),
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]);
        // }


        // // ---------------------------------------------
        // // RECENT PAYMENTS (CLEAR FOR DASHBOARD DISPLAY)
        // // ---------------------------------------------
        // foreach (range(1, 10) as $i) {
        //     Payment::factory()->create([
        //         'amount' => rand(500, 5000),
        //         'method' => collect(['mpesa', 'cash', 'card'])->random(),
        //         'status' => collect(['success', 'pending'])->random(),
        //         'paid_at' => now()->subHours(rand(1, 48)),
        //         'customer_id' => $customers->random()->id,
        //         'processed_by_user_id' => $cashier->id,
        //     ]);
        // }
    }
}
