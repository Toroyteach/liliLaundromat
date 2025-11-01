<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
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
        $id = $this->route('branch');

        return [
            'name' => ['required', 'string', 'max:255', 'unique:branches,name,' . $id],
            'location' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Branch name is required.',
            'name.unique' => 'This branch name already exists.',
            'name.max' => 'Branch name must not exceed 255 characters.',
            'location.max' => 'Location must not exceed 255 characters.',
            'phone.max' => 'Phone must not exceed 255 characters.',
        ];
    }
}
