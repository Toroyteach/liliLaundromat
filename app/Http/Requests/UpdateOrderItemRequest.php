<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('order_item');

        return [
            'order_id'       => ['required', 'integer', 'exists:orders,id'],
            'garment_type'   => ['required', 'string', 'max:255'],
            'pricing_mode'   => ['required', 'in:per_piece,per_kg'],
            'quantity'       => ['required', 'integer', 'min:1'],
            'weight_kg'      => ['nullable', 'numeric', 'min:0'],
            'unit_price'     => ['required', 'numeric', 'min:0'],
            'total_price'    => ['required', 'numeric', 'min:0'],
            'color'          => ['nullable', 'string', 'max:255'],
            'material'       => ['nullable', 'string', 'max:255'],
            'barcode_number' => ['required', 'string', 'max:255', 'unique:order_items,barcode_number,' . $id],
            'status'         => ['required', 'string', 'max:255'],
            'notes'          => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'Order is required.',
            'order_id.exists'   => 'Order not found.',

            'garment_type.required' => 'Garment type is required.',

            'pricing_mode.required' => 'Pricing mode is required.',
            'pricing_mode.in'       => 'Pricing mode must be per_piece or per_kg.',

            'quantity.required' => 'Quantity is required.',
            'quantity.min'      => 'Quantity must be minimum of 1.',

            'unit_price.required'  => 'Unit price is required.',
            'unit_price.numeric'   => 'Unit price must be numeric.',
            'total_price.required' => 'Total price is required.',

            'barcode_number.required' => 'Barcode number is required.',
            'barcode_number.unique'   => 'Barcode number already used.',

            'status.required' => 'Status is required.',
        ];
    }
}
