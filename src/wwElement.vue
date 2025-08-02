<template>
  <div
    class="carousel-root"
    @click="handleClick"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- Carousel container -->
    <div class="carousel-viewport">
      <!-- Slides container -->
      <div
        ref="slidesContainer"
        :class="[
          'carousel-slides',
          {
            'carousel-slides-sm': content.height === 'sm',
            'carousel-slides-md': content.height === 'md' || !content.height,
            'carousel-slides-lg': content.height === 'lg',
            'carousel-slides-xl': content.height === 'xl'
          }
        ]"
        :style="{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${totalSlides * 100}%`
        }"
      >
        <!-- Slides -->
        <div
          v-for="(slide, index) in content.slides || []"
          :key="slide.id || index"
          class="carousel-slide"
          :style="{ width: `${100 / totalSlides}%` }"
        >
          <!-- Image slide -->
          <img
            v-if="slide.type === 'image' || !slide.type"
            :src="slide.src"
            :alt="slide.alt || slide.title || 'Slide image'"
            :class="[
              'carousel-image',
              slide.imageClass
            ]"
            @click="handleSlideClick(slide, index)"
          />
          
          <!-- Video slide -->
          <video
            v-else-if="slide.type === 'video'"
            :src="slide.src"
            :class="[
              'carousel-video',
              slide.videoClass
            ]"
            :controls="slide.showControls !== false"
            :autoplay="slide.autoplay === true"
            :muted="slide.muted !== false"
            :loop="slide.loop === true"
            @click="handleSlideClick(slide, index)"
          />
          
          <!-- Custom content slide -->
          <div
            v-else-if="slide.type === 'content'"
            :class="[
              'carousel-content',
              slide.contentClass
            ]"
            :style="slide.contentStyle"
            @click="handleSlideClick(slide, index)"
          >
            <div class="carousel-content-inner">
              <h3 v-if="slide.title" class="carousel-content-title">
                {{ slide.title }}
              </h3>
              <p v-if="slide.description" class="carousel-content-description">
                {{ slide.description }}
              </p>
              <div v-if="slide.htmlContent" v-html="slide.htmlContent" />
              
              <!-- Action button -->
              <button
                v-if="slide.actionLabel"
                @click.stop="handleSlideAction(slide, index)"
                :class="[
                  'carousel-action-button',
                  {
                    'carousel-action-outline': slide.actionVariant === 'outline',
                    'carousel-action-secondary': slide.actionVariant === 'secondary',
                    'carousel-action-ghost': slide.actionVariant === 'ghost',
                    'carousel-action-primary': !slide.actionVariant
                  }
                ]"
              >
                {{ slide.actionLabel }}
              </button>
            </div>
          </div>

          <!-- Slide overlay -->
          <div
            v-if="slide.overlay && (slide.title || slide.description)"
            :class="[
              'carousel-overlay',
              slide.overlayClass
            ]"
          >
            <div class="carousel-overlay-content">
              <h3 v-if="slide.title" class="carousel-overlay-title">
                {{ slide.title }}
              </h3>
              <p v-if="slide.description" class="carousel-overlay-description">
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
          class="carousel-nav carousel-nav-prev"
          :aria-label="'Previous slide'"
        >
          <svg class="carousel-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next button -->
        <button
          @click="nextSlide"
          :disabled="currentIndex === totalSlides - 1 && !content.loop"
          class="carousel-nav carousel-nav-next"
          :aria-label="'Next slide'"
        >
          <svg class="carousel-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Indicators/Dots -->
    <div
      v-if="content.showIndicators !== false && totalSlides > 1"
      class="carousel-indicators"
    >
      <button
        v-for="(slide, index) in content.slides || []"
        :key="`indicator-${index}`"
        @click="goToSlide(index)"
        :class="[
          'carousel-indicator',
          { 'carousel-indicator-active': index === currentIndex }
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <!-- Thumbnails -->
    <div
      v-if="content.showThumbnails && totalSlides > 1"
      class="carousel-thumbnails"
    >
      <button
        v-for="(slide, index) in content.slides || []"
        :key="`thumb-${index}`"
        @click="goToSlide(index)"
        :class="[
          'carousel-thumbnail',
          { 'carousel-thumbnail-active': index === currentIndex }
        ]"
      >
        <img
          v-if="slide.thumbnail || (slide.type === 'image' || !slide.type)"
          :src="slide.thumbnail || slide.src"
          :alt="`Thumbnail ${index + 1}`"
          class="carousel-thumbnail-image"
        />
        <div
          v-else
          class="carousel-thumbnail-placeholder"
        >
          {{ index + 1 }}
        </div>
      </button>
    </div>

    <!-- Auto-play controls -->
    <div
      v-if="content.autoPlay && content.showPlayPause"
      class="carousel-play-pause"
    >
      <button
        @click="toggleAutoPlay"
        class="carousel-play-pause-button"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <svg v-if="isPlaying" class="carousel-play-pause-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
        </svg>
        <svg v-else class="carousel-play-pause-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShadcnCarousel',
  props: {
    content: {
      type: Object,
      required: true,
      default: () => ({
        slides: [],
        autoPlay: false,
        autoPlayInterval: 3000,
        loop: true,
        pauseOnHover: true,
        showArrows: true,
        showIndicators: true,
        showThumbnails: false,
        showPlayPause: false,
        height: 'md'
      })
    },
    wwEditorState: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentIndex: 0,
      isPlaying: !!this.content.autoPlay,
      autoPlayInterval: null
    }
  },
  computed: {
    totalSlides() {
      return this.content.slides ? this.content.slides.length : 0
    }
  },
  watch: {
    currentIndex() {
      if (this.isPlaying) {
        this.stopAutoPlay()
        this.startAutoPlay()
      }
    },
    'content.slides'() {
      if (this.currentIndex >= this.totalSlides) {
        this.currentIndex = Math.max(0, this.totalSlides - 1)
      }
    }
  },
  mounted() {
    if (this.content.autoPlay) {
      this.startAutoPlay()
    }
    
    // Add keyboard event listener
    document.addEventListener('keydown', this.handleKeyDown)
  },
  beforeDestroy() {
    this.stopAutoPlay()
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {

    startAutoPlay() {
      if (this.content.autoPlay && this.totalSlides > 1) {
        this.autoPlayInterval = setInterval(() => {
          this.nextSlide()
        }, this.content.autoPlayInterval || 3000)
      }
    },

    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
        this.autoPlayInterval = null
      }
    },

    pauseAutoPlay() {
      if (this.content.pauseOnHover !== false) {
        this.stopAutoPlay()
      }
    },

    resumeAutoPlay() {
      if (this.content.pauseOnHover !== false && this.isPlaying) {
        this.startAutoPlay()
      }
    },

    toggleAutoPlay() {
      this.isPlaying = !this.isPlaying
      
      if (this.isPlaying) {
        this.startAutoPlay()
      } else {
        this.stopAutoPlay()
      }
    },

    nextSlide() {
      if (this.currentIndex < this.totalSlides - 1) {
        this.currentIndex++
      } else if (this.content.loop !== false) {
        this.currentIndex = 0
      }
      
      this.emitSlideChange()
    },

    previousSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      } else if (this.content.loop !== false) {
        this.currentIndex = this.totalSlides - 1
      }
      
      this.emitSlideChange()
    },

    goToSlide(index) {
      if (index >= 0 && index < this.totalSlides) {
        this.currentIndex = index
        this.emitSlideChange()
      }
    },

    emitSlideChange() {
      const currentSlide = this.content.slides?.[this.currentIndex]
      this.$emit('trigger-event', {
        domEvent: null,
        value: {
          index: this.currentIndex,
          slide: currentSlide,
          total: this.totalSlides
        }
      })
    },

    handleSlideClick(slide, index) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          type: 'slide-click',
          slide,
          index
        }
      })
    },

    handleSlideAction(slide, index) {
      this.$emit('trigger-event', {
        domEvent: event,
        value: {
          type: 'slide-action',
          slide,
          index,
          action: slide.actionLabel
        }
      })
    },

    handleClick(domEvent) {
      // Base click handler if needed
    },

    // Handle keyboard navigation
    handleKeyDown(event) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          this.previousSlide()
          break
        case 'ArrowRight':
          event.preventDefault()
          this.nextSlide()
          break
        case ' ':
          event.preventDefault()
          if (this.content.autoPlay) {
            this.toggleAutoPlay()
          }
          break
      }
    }
  }
}
</script>

<style scoped>
/* Shadcn UI CSS Variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 98%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --ring: 212.7 26.8% 83.9%;
}

/* Root container */
.carousel-root {
  position: relative;
  width: 100%;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Viewport */
.carousel-viewport {
  position: relative;
  overflow: hidden;
  border-radius: calc(var(--radius) + 2px);
}

/* Slides container */
.carousel-slides {
  display: flex;
  transition: transform 0.3s ease-in-out;
}

.carousel-slides-sm {
  height: 12rem; /* 192px */
}

.carousel-slides-md {
  height: 16rem; /* 256px */
}

.carousel-slides-lg {
  height: 20rem; /* 320px */
}

.carousel-slides-xl {
  height: 24rem; /* 384px */
}

/* Individual slide */
.carousel-slide {
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--muted));
}

/* Slide content types */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.carousel-content-inner {
  max-width: 100%;
}

.carousel-content-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: hsl(var(--foreground));
}

.carousel-content-description {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  color: hsl(var(--muted-foreground));
}

/* Action button */
.carousel-action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: calc(var(--radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  outline: none;
  border: none;
  cursor: pointer;
  height: 2.5rem;
  padding: 0 1rem;
}

.carousel-action-button:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.carousel-action-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.carousel-action-primary:hover {
  background-color: hsl(var(--primary) / 0.9);
}

.carousel-action-outline {
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.carousel-action-outline:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.carousel-action-secondary {
  background-color: hsl(var(--secondary));
  color: hsl(var(--secondary-foreground));
}

.carousel-action-secondary:hover {
  background-color: hsl(var(--secondary) / 0.8);
}

.carousel-action-ghost {
  background: none;
  color: hsl(var(--foreground));
}

.carousel-action-ghost:hover {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

/* Overlay */
.carousel-overlay {
  position: absolute;
  inset: 0;
  background-color: rgb(0 0 0 / 0.4);
  display: flex;
  align-items: flex-end;
  padding: 1.5rem;
}

.carousel-overlay-content {
  color: white;
}

.carousel-overlay-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.carousel-overlay-description {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Navigation arrows */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: hsl(var(--background) / 0.8);
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.15s ease;
  cursor: pointer;
}

.carousel-nav:hover {
  background-color: hsl(var(--background));
}

.carousel-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-nav-prev {
  left: 1rem;
}

.carousel-nav-next {
  right: 1rem;
}

.carousel-nav-icon {
  width: 1rem;
  height: 1rem;
}

/* Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.carousel-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  transition: all 0.15s ease;
  cursor: pointer;
  border: none;
  background-color: hsl(var(--muted));
}

.carousel-indicator:hover {
  background-color: hsl(var(--muted-foreground) / 0.2);
}

.carousel-indicator-active {
  background-color: hsl(var(--primary));
}

/* Thumbnails */
.carousel-thumbnails {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
}

.carousel-thumbnail {
  flex-shrink: 0;
  width: 4rem;
  height: 4rem;
  border-radius: calc(var(--radius) - 2px);
  overflow: hidden;
  border: 2px solid hsl(var(--muted));
  transition: all 0.15s ease;
  cursor: pointer;
  background: none;
  padding: 0;
}

.carousel-thumbnail:hover {
  border-color: hsl(var(--muted-foreground) / 0.2);
}

.carousel-thumbnail-active {
  border-color: hsl(var(--primary));
}

.carousel-thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--muted));
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
}

/* Play/Pause controls */
.carousel-play-pause {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 10;
}

.carousel-play-pause-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: hsl(var(--background) / 0.8);
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: all 0.15s ease;
  cursor: pointer;
}

.carousel-play-pause-button:hover {
  background-color: hsl(var(--background));
}

.carousel-play-pause-icon {
  width: 1rem;
  height: 1rem;
}
</style>