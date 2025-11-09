<?php

namespace App\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('viewAny', Branch::class)) {
                abort(403, __('Unauthorized Action'));
            }
            return Inertia::render('branch/index', [
                'branches' => Branch::all()
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function store(StoreBranchRequest $request): Response|RedirectResponse
    {
        try {
            if (!Gate::allows('create', Branch::class)) {
                abort(403, __('Unauthorized Action'));
            }

            $branch = Branch::create($request->validated());

            return back()->with(['data' => $branch], 201);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Branch $branch): Response|RedirectResponse
    {
        if (!Gate::allows('view', $branch)) {
            abort(403, __('Unauthorized Action'));
        }

        return back()->with(['data' => $branch]);
    }

    public function update(UpdateBranchRequest $request, Branch $branch): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('update', $branch)) {
                abort(403, __('Unauthorized Action'));
            }

            $branch->update($request->validated());

            return Inertia::render('branch/show', [
                'branch' => $branch
            ]);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Branch $branch): Response|RedirectResponse
    {
        try {

            if (!Gate::allows('delete', $branch)) {
                abort(403, __('Unauthorized Action'));
            }

            $branch->delete();

            return back()->with(['message' => 'Branch deleted successfully']);
        } catch (\Throwable $e) {
            return back()->with(['error' => $e->getMessage()], 500);
        }
    }
}
