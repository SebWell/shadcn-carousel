<template>
  <div
    :class="cn(
      'relative w-full',
      content.customClass
    )"
    :style="content.customStyle"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- Carousel container -->
    <div class="relative overflow-hidden rounded-lg">
      <!-- Slides container -->
      <div
        ref="slidesContainer"
        :class="cn(
          'flex transition-transform duration-300 ease-in-out',
          content.height === 'sm' ? 'h-48' : '',
          content.height === 'md' ? 'h-64' : '',
          content.height === 'lg' ? 'h-80' : '',
          content.height === 'xl' ? 'h-96' : '',
          !content.height ? 'h-64' : ''
        )"
        :style="{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${totalSlides * 100}%`
        }"
      >
        <!-- Slides -->
        <div
          v-for="(slide, index) in content.slides"
          :key="slide.id || index"
          :class="cn(
            'flex-shrink-0 relative overflow-hidden',
            'w-full flex items-center justify-center bg-muted'
          )"
          :style="{ width: `${100 / totalSlides}%` }"
        >
          <!-- Image slide -->
          <img
            v-if="slide.type === 'image' || !slide.type"
            :src="slide.src"
            :alt="slide.alt || slide.title || 'Slide image'"
            :class="cn(
              'w-full h-full object-cover',
              slide.imageClass
            )"
            @click="handleSlideClick(slide, index)"
          />
          
          <!-- Video slide -->
          <video
            v-else-if="slide.type === 'video'"
            :src="slide.src"
            :class="cn(
              'w-full h-full object-cover',
              slide.videoClass
            )"
            :controls="slide.showControls !== false"
            :autoplay="slide.autoplay === true"
            :muted="slide.muted !== false"
            :loop="slide.loop === true"
            @click="handleSlideClick(slide, index)"
          />
          
          <!-- Custom content slide -->
          <div
            v-else-if="slide.type === 'content'"
            :class="cn(
              'w-full h-full flex items-center justify-center p-8 text-center',
              slide.contentClass
            )"
            :style="slide.contentStyle"
            @click="handleSlideClick(slide, index)"
          >
            <div>
              <h3 v-if="slide.title" class="text-2xl font-bold mb-4">
                {{ slide.title }}
              </h3>
              <p v-if="slide.description" class="text-lg mb-6 text-muted-foreground">
                {{ slide.description }}
              </p>
              <div v-if="slide.htmlContent" v-html="slide.htmlContent" />
              
              <!-- Action button -->
              <button
                v-if="slide.actionLabel"
                @click.stop="handleSlideAction(slide, index)"
                :class="cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 py-2',
                  slide.actionVariant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : '',
                  slide.actionVariant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : '',
                  slide.actionVariant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : '',
                  !slide.actionVariant ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                )"
              >
                {{ slide.actionLabel }}
              </button>
            </div>
          </div>

          <!-- Slide overlay -->
          <div
            v-if="slide.overlay && (slide.title || slide.description)"
            :class="cn(
              'absolute inset-0 bg-black/40 flex items-end p-6',
              slide.overlayClass
            )"
          >
            <div class="text-white">
              <h3 v-if="slide.title" class="text-xl font-semibold mb-2">
                {{ slide.title }}
              </h3>
              <p v-if="slide.description" class="text-sm opacity-90">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation arrows -->
      <div v-if="content.showArrows !== false && totalSlides > 1">
        <!-- Previous button -->
        <button
          @click="previousSlide"
          :disabled="currentIndex === 0 && !content.loop"
          :class="cn(
            'absolute left-4 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center w-8 h-8 rounded-full bg-background/80 hover:bg-background',
            'border shadow-sm transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )"
          :aria-label="'Previous slide'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next button -->
        <button
          @click="nextSlide"
          :disabled="currentIndex === totalSlides - 1 && !content.loop"
          :class="cn(
            'absolute right-4 top-1/2 -translate-y-1/2 z-10',
            'flex items-center justify-center w-8 h-8 rounded-full bg-background/80 hover:bg-background',
            'border shadow-sm transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )"
          :aria-label="'Next slide'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Indicators/Dots -->
    <div
      v-if="content.showIndicators !== false && totalSlides > 1"
      class="flex justify-center space-x-2 mt-4"
    >
      <button
        v-for="(slide, index) in content.slides"
        :key="`indicator-${index}`"
        @click="goToSlide(index)"
        :class="cn(
          'w-2 h-2 rounded-full transition-colors',
          index === currentIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/20'
        )"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <!-- Thumbnails -->
    <div
      v-if="content.showThumbnails && totalSlides > 1"
      class="flex justify-center space-x-2 mt-4 overflow-x-auto"
    >
      <button
        v-for="(slide, index) in content.slides"
        :key="`thumb-${index}`"
        @click="goToSlide(index)"
        :class="cn(
          'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
          index === currentIndex ? 'border-primary' : 'border-muted hover:border-muted-foreground/20'
        )"
      >
        <img
          v-if="slide.thumbnail || (slide.type === 'image' || !slide.type)"
          :src="slide.thumbnail || slide.src"
          :alt="`Thumbnail ${index + 1}`"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs"
        >
          {{ index + 1 }}
        </div>
      </button>
    </div>

    <!-- Auto-play controls -->
    <div
      v-if="content.autoPlay && content.showPlayPause"
      class="absolute bottom-4 right-4 z-10"
    >
      <button
        @click="toggleAutoPlay"
        :class="cn(
          'flex items-center justify-center w-8 h-8 rounded-full bg-background/80 hover:bg-background',
          'border shadow-sm transition-colors'
        )"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <svg v-if="isPlaying" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['slide-change', 'slide-click', 'slide-action'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const slidesContainer = ref(null)
    const currentIndex = ref(0)
    const isPlaying = ref(!!props.content.autoPlay)
    let autoPlayInterval = null

    const totalSlides = computed(() => {
      return props.content.slides ? props.content.slides.length : 0
    })

    const startAutoPlay = () => {
      if (props.content.autoPlay && totalSlides.value > 1) {
        autoPlayInterval = setInterval(() => {
          nextSlide()
        }, props.content.autoPlayInterval || 3000)
      }
    }

    const stopAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
        autoPlayInterval = null
      }
    }

    const pauseAutoPlay = () => {
      if (props.content.pauseOnHover !== false) {
        stopAutoPlay()
      }
    }

    const resumeAutoPlay = () => {
      if (props.content.pauseOnHover !== false && isPlaying.value) {
        startAutoPlay()
      }
    }

    const toggleAutoPlay = () => {
      isPlaying.value = !isPlaying.value
      
      if (isPlaying.value) {
        startAutoPlay()
      } else {
        stopAutoPlay()
      }
    }

    const nextSlide = () => {
      if (currentIndex.value < totalSlides.value - 1) {
        currentIndex.value++
      } else if (props.content.loop !== false) {
        currentIndex.value = 0
      }
      
      emitSlideChange()
    }

    const previousSlide = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--
      } else if (props.content.loop !== false) {
        currentIndex.value = totalSlides.value - 1
      }
      
      emitSlideChange()
    }

    const goToSlide = (index) => {
      if (index >= 0 && index < totalSlides.value) {
        currentIndex.value = index
        emitSlideChange()
      }
    }

    const emitSlideChange = () => {
      const currentSlide = props.content.slides?.[currentIndex.value]
      emit('slide-change', {
        index: currentIndex.value,
        slide: currentSlide,
        total: totalSlides.value
      })
    }

    const handleSlideClick = (slide, index) => {
      emit('slide-click', {
        slide,
        index
      })
    }

    const handleSlideAction = (slide, index) => {
      emit('slide-action', {
        slide,
        index,
        action: slide.actionLabel
      })
    }

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          previousSlide()
          break
        case 'ArrowRight':
          event.preventDefault()
          nextSlide()
          break
        case ' ':
          event.preventDefault()
          if (props.content.autoPlay) {
            toggleAutoPlay()
          }
          break
      }
    }

    // Watch for slide changes to restart auto-play
    watch(() => currentIndex.value, () => {
      if (isPlaying.value) {
        stopAutoPlay()
        startAutoPlay()
      }
    })

    // Watch for content changes
    watch(() => props.content.slides, () => {
      if (currentIndex.value >= totalSlides.value) {
        currentIndex.value = Math.max(0, totalSlides.value - 1)
      }
    })

    onMounted(() => {
      if (props.content.autoPlay) {
        startAutoPlay()
      }
      
      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown)
    })

    onBeforeUnmount(() => {
      stopAutoPlay()
      document.removeEventListener('keydown', handleKeyDown)
    })

    return {
      cn,
      slidesContainer,
      currentIndex,
      isPlaying,
      totalSlides,
      nextSlide,
      previousSlide,
      goToSlide,
      toggleAutoPlay,
      pauseAutoPlay,
      resumeAutoPlay,
      handleSlideClick,
      handleSlideAction
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 