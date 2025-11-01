<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
            'order_id'             => ['required', 'integer', 'exists:orders,id'],
            'customer_id'          => ['required', 'integer', 'exists:customers,id'],
            'amount'               => ['required', 'numeric', 'min:0'],
            'method'               => ['required', 'string', 'max:255'],
            'mpesa_reference'      => ['nullable', 'string', 'max:255', 'unique:payments,mpesa_reference'],
            'status'               => ['required', 'string', 'max:255'],
            'processed_by_user_id' => ['required', 'integer', 'exists:users,id'],
            'paid_at'              => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'Order is required.',
            'order_id.exists'   => 'Order not found.',

            'customer_id.required' => 'Customer is required.',
            'customer_id.exists'   => 'Customer not found.',

            'amount.required' => 'Payment amount is required.',
            'amount.numeric'  => 'Payment amount must be numeric.',

            'method.required' => 'Payment method is required.',

            'mpesa_reference.unique' => 'M-Pesa reference number already exists.',

            'status.required' => 'Payment status is required.',

            'processed_by_user_id.required' => 'Processing user is required.',
            'processed_by_user_id.exists'   => 'Processing user not found.',
        ];
    }
}
