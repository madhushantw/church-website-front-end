<script setup lang="ts">
defineProps<Props>()
interface Props {
	title: string
	day: string
	time: string
	place: string
}
</script>
<template>
  <div
    class="flex items-center gap-5 px-8 py-6 hover:bg-white/5 transition-colors group"
  >
    <div
      class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors"
    >
			<UIcon
				name="mdi:clock-outline"
				:size="24"
				class="text-white"
			/>
		</div>
    <div class="flex-col">
      <div class="text-white/60 text-[11px] tracking-widest uppercase mb-0.5">
        {{ day }}
      </div>
      <div class="text-white font-medium text-[15px]">{{ title }}</div>
      <div class="text-accent text-[14px] font-semibold">{{ time }}</div>
      <div class="text-white/50 text-[12px] mt-0.5">{{ place }}</div>
    </div>
  </div>
</template>
