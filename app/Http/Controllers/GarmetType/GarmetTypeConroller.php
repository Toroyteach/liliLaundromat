<?php

namespace App\Http\Controllers\GarmetType;

use App\Http\Controllers\Controller;
use App\Models\GarmetType;
use Illuminate\Http\Request;
use App\Http\Requests\StoreGarmetTypeRequest;
use App\Http\Requests\UpdateGarmetTypeRequest;
use Illuminate\Support\Facades\Gate;

class GarmetTypeConroller extends Controller
{
    public function index()
    {
        if (!Gate::allows('viewAny', GarmetType::class)) {
            abort(403, __('Unauthorized Action'));
        }

        return response()->json([
            'success' => true,
            'data' => GarmetType::all()
        ]);
    }

    public function store(StoreGarmetTypeRequest $request)
    {
        try {
            if (!Gate::allows('create', GarmetType::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $garmetType = GarmetType::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Garment type created successfully',
                'data' => $garmetType
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error creating garment type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateGarmetTypeRequest $request, GarmetType $id)
    {
        try {
            if (!Gate::allows('update', $id)) {
                abort(403, __('Unauthorized Action'));
            }

            $garmetType = GarmetType::findOrFail($id);
            $garmetType->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Garment type updated successfully',
                'data' => $garmetType
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error updating garment type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(GarmetType $id)
    {
        try {
            if (!Gate::allows('delete', $id)) {
                abort(403, __('Unauthorized Action'));
            }

            $garmetType = GarmetType::findOrFail($id);
            $garmetType->delete();

            return response()->json([
                'success' => true,
                'message' => 'Garment type deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting garment type',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
