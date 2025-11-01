<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name'          => ['required', 'string', 'max:255'],
            'phone'         => ['required', 'string', 'max:50', 'unique:customers,phone'],
            'email'         => ['nullable', 'email', 'max:255'],
            'address'       => ['nullable', 'string'],
            'loyalty_points'=> ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages()
    {
        return [
            'name.required'     => 'Customer name is required.',
            'phone.required'    => 'Phone is required.',
            'phone.unique'      => 'This phone number already exists.',
            'email.email'       => 'Please enter a valid email address.',
        ];
    }
}
