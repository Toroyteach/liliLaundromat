<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGarmetTypeRequest extends FormRequest
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
            'name' => 'required|string|unique:garmet_types,name',
            'default_pricing_mode' => 'required|in:per_piece,per_kg',
            'default_price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Garment type name is required',
            'name.unique' => 'This garment type already exists',
            'default_pricing_mode.required' => 'Pricing mode is required',
            'default_pricing_mode.in' => 'Pricing mode must be either per_piece or per_kg',
            'default_price.required' => 'Default price is required',
            'default_price.numeric' => 'Default price must be a valid number',
        ];
    }
}
