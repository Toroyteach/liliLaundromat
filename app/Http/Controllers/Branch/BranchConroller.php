<?php

namespace App\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class BranchConroller extends Controller
{
    public function index(): JsonResponse
    {
        try {
            if (!Gate::allows('viewAny', Branch::class)) {
                abort(403, __('Unauthorized Action'));
            }

            return response()->json([
                'data' => Branch::all()
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreBranchRequest $request): JsonResponse
    {
        try {
            if (!Gate::allows('create', Branch::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $branch = Branch::create($request->validated());

            return response()->json(['data' => $branch], 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Branch $branch): JsonResponse
    {
        if (!Gate::allows('view', $branch)) {
            abort(403, __('Unauthorized Action'));
        }

        return response()->json(['data' => $branch]);
    }

    public function update(UpdateBranchRequest $request, Branch $branch): JsonResponse
    {
        try {

            if (!Gate::allows('update', $branch)) {
                abort(403, __('Unauthorized Action'));
            }

            $branch->update($request->validated());

            return response()->json(['data' => $branch]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Branch $branch): JsonResponse
    {
        try {

            if (!Gate::allows('delete', $branch)) {
                abort(403, __('Unauthorized Action'));
            }

            $branch->delete();

            return response()->json(['message' => 'Branch deleted successfully']);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
