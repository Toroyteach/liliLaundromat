<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id'          => ['required', 'integer', 'exists:orders,id'],
            'invoice_number'    => ['required', 'string', 'max:255', 'unique:invoices,invoice_number'],
            'subtotal'          => ['required', 'numeric', 'min:0'],
            'discount'          => ['required', 'numeric', 'min:0'],
            'tax'               => ['required', 'numeric', 'min:0'],
            'total'             => ['required', 'numeric', 'min:0'],
            'sent_to_customer'  => ['required', 'boolean'],
            'generated_at'      => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'Order is required.',
            'order_id.exists'   => 'Order not found.',

            'invoice_number.required' => 'Invoice number is required.',
            'invoice_number.unique'   => 'Invoice number already exists.',

            'subtotal.required' => 'Subtotal is required.',
            'discount.required' => 'Discount is required.',
            'tax.required'      => 'Tax is required.',
            'total.required'    => 'Total amount is required.',

            'sent_to_customer.required' => 'Sent to customer flag is required.',
        ];
    }
}
