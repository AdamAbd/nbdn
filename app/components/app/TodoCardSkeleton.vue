<template>
  <div class="bg-background space-y-3 rounded-lg border p-4 shadow-sm" aria-hidden="true">
    <UiSkeleton class="h-40 w-full rounded-md" />

    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="w-full space-y-2">
        <div class="flex items-start gap-2">
          <UiSkeleton class="mt-1 size-4 rounded-sm" />
          <div class="w-full space-y-2">
            <UiSkeleton class="h-5 w-2/3" />
            <UiSkeleton class="h-4 w-full" />
          </div>
        </div>
        <UiSkeleton class="h-3 w-1/2" />
      </div>
      <div class="flex items-center gap-2">
        <UiSkeleton class="h-8 w-16" />
        <UiSkeleton class="h-8 w-16" />
      </div>
    </div>

    <div class="bg-muted/40 space-y-2 rounded-md p-3">
      <UiSkeleton class="h-3 w-20" />
      <UiSkeleton class="h-3 w-full" />
      <UiSkeleton class="h-3 w-5/6" />
      <UiSkeleton class="h-3 w-3/4" />
    </div>
  </div>
</template>
