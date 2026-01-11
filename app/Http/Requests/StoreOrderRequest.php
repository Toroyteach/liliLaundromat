<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
        return [
            'customer_id'  => ['nullable', 'integer', 'exists:customers,id'],
            'user_id'      => ['required', 'integer', 'exists:users,id'],
            'branch_id'    => ['nullable', 'integer', 'exists:branches,id'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'customer_phone' => ['required', 'string', 'min:0'],
            'customer_name' => ['required', 'string', 'min:0'],
            'customer_address' => ['required', 'string', 'min:0'],
            'customer_email' => ['required', 'email', 'min:0'],
            'status'       => ['required', 'string'],
            'due_date'     => ['nullable', 'date'],
            'weight_kg' => ['nullable', 'numeric', 'min:0'],

            'payment_method' => ['required', 'string', 'in:cash,mpesa,airtel-money,card'],
            'payment_status' => ['required', 'string', 'in:pending,completed,failed,pay-on-delivery'],
            'transaction_id' => ['nullable', 'string', 'max:255'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.service_type' => ['required', 'string'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.total_price' => ['required', 'numeric', 'min:0'],
            'items.*.status' => ['required', 'string'],
            'items.*.garment_type' => ['nullable', 'string'],
            'items.*.material' => ['nullable', 'string'],
            'items.*.color' => ['nullable', 'string'],
            'items.*.notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer is required.',
            'customer_id.exists'   => 'Customer not found.',
            'user_id.required'     => 'User is required.',
            'user_id.exists'       => 'User not found.',
            'branch_id.required'   => 'Branch is required.',
            'branch_id.exists'     => 'Branch not found.',
            'total_amount.required' => 'Total amount is required.',
            'total_amount.numeric' => 'Total amount must be numeric.',
            'total_amount.min'     => 'Total amount cannot be negative.',
            'status.required'      => 'Status is required.',
            'status.max'           => 'Status cannot exceed 255 characters.',
            'due_date.date'        => 'Due date must be a valid date format.',
        ];
    }
}
