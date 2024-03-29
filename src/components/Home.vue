<template lang="pug">
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        form(@submit.prevent="onSubmit")
          // Task title
          .form-item(:class="{ errorInput: $v.taskTitle.$error }")
            input(
              type="text"
              placeholder="What we will watch?"
              v-model="taskTitle"
              :class="{ error: $v.taskTitle.$error }"
            )
            .error(v-if="!$v.taskTitle.required") Title is required.

          // Task desr
          .form-item
            textarea(
              type="text"
              placeholder="Description"
              v-model="taskDescription"
            )

          // WHAT WE WATCH
          .option-list
            input.what-watch--radio(
              type="radio"
              id="radioFilm"
              value="Film"
              v-model="whatWatch"
            )
            label(
              for="radioFilm"
            ) Film
            input.what-watch--radio(
              type="radio"
              id="radioSerial"
              value="Serial"
              v-model="whatWatch"
            )
            label(
              for="radioSerial"
            ) Serial

          // TOTAL TIME
          .total-time
            // Film Time
            .total-time__film(
              v-if="whatWatch === 'Film'"
            )
              span.time-title Hours
              input.time-input(
                type="Number"
                v-model="filmHours"
              )
              span.time-title Minutes
              input.time-input(
                type="Number"
                v-model="filmMinutes"
              )
              p {{ filmTime }}

            // Serial Time
            .total-time__serial(
              v-if="whatWatch === 'Serial'"
            )
              span.time-title How many seasons?
              input.time-input(
                type="Number"
                v-model="serialSeasons"
              )
              span.time-title How many series?
              input.time-input(
                type="Number"
                v-model="serialSeries"
              )
              span.time-title How long is one series? (in minutes)
              input.time-input(
                type="Number"
                v-model="serialSeriesMinutes"
              )
              p {{ serialTime }}

          // TAG LIST
          // Add New Tag
          .tag-list.tag-list--add
            .ui-tag__wrapper(
              @click="tagMenuShow = !tagMenuShow"
            )
              .ui-tag
                span.tag-title Add New
                span.button-close(
                  :class="{ active: !tagMenuShow }"
                )

          // Show Input
          .tag-list.tag-list--menu(
            v-if="tagMenuShow"
          )
            input.tag-add--input(
              type="text"
              placeholder="New tag"
              v-model="tagTitle"
              @keyup.enter="newTag"
            )

          //All Tags
          .tag-list
            transition-group(
              enter-active-class="animated fadeInRight"
              leave-active-class="animated fadeOutDown"
            )
              .ui-tag__wrapper(
                v-for="tag in tags"
                :key="tag.title"
              )
                .ui-tag(
                  @click="addTagUsed(tag)"
                  :class="{used: tag.use}"
                )
                  span.tag-title {{ tag.title }}
                  span.button-close

          // SUBMIT
          .row.grid-end
            button.button.button-primary.button--round(
                type="submit"
                :disabled="submitStatus === 'PENDING'"
            ) Add {{ whatWatch }}
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      submitStatus: null,
      taskTitle: '',
      taskDescription: '',
      whatWatch: 'Film',

      // Total Time
      // Film
      filmHours: 1,
      filmMinutes: 30,
      // Serial
      serialSeasons: 1,
      serialSeries: 11,
      serialSeriesMinutes: 40,

      // Tags
      tagTitle: '',
      tagMenuShow: false,
      tagsUsed: []
    }
  },
  validations: {
    taskTitle: {
      required
    }
  },
  methods: {
    newTag () {
      if (this.tagTitle === '') {
        return
      }
      const tag = {
        title: this.tagTitle,
        use: false
      }
      this.$store.dispatch('newTag', tag)
      // Reset
      this.tagTitle = ''
    },

    // Submit NEW TASK
    onSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        console.log('ERROR')
        this.submitStatus = 'ERROR'
      } else {
        // Vaild
        console.log('SEND')
        this.submitStatus = 'PENDING'
        // Firebase waiting
        setTimeout(() => {
          this.submitStatus = 'OK'
        }, 500)
        // Time
        let time
        if (this.whatWatch === 'Film') {
          time = this.filmTime
        } else {
          time = this.serialTime
        }

        // Task
        const task = {
          title: this.taskTitle,
          description: this.taskDescription,
          whatWatch: this.whatWatch,
          time,
          tags: this.tagsUsed,
          completed: false,
          editing: false
        }
        this.$store.dispatch('newTask', task)
        // Reset
        this.taskTitle = ''
        this.taskDescription = ''
        // Reset $v (validate)
        this.$v.$reset()
        // Reset for Tags
        this.tagMenuShow = false
        this.tagsUsed = []
        this.tagTitle = ''
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].use = false
        }
      }
    },

    addTagUsed (tag) {
      tag.use = !tag.use
      if (tag.use) {
        this.tagsUsed.push({
          title: tag.title
        })
      } else {
        this.tagsUsed.splice(tag.title, 1)
      }
    },

    // Total Time
    getHoursAndMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      return hours + ' Hours ' + min + ' Minutes'
    }
  },
  computed: {
    tags () {
      return this.$store.getters.tags
    },

    // Total Time
    filmTime () {
      let min = (this.filmHours * 60) + (this.filmMinutes * 1)
      return this.getHoursAndMinutes(min)
    },
    serialTime () {
      let min = this.serialSeasons * this.serialSeries * this.serialSeriesMinutes
      return this.getHoursAndMinutes(min)
    }
  }
}
</script>

<style lang="stylus" scoped>
.option-list
  display flex
  align-items center
  margin-bottom 20px
  .what-watch--radio
    margin-right 12px
  input
    margin-bottom 0
  label
    margin-right 20px
    margin-bottom 0
    &:last-child
      margin-right 0

// Total Time
.total-time
  margin-bottom 20px

.time-title
  display block
  margin-bottom 6px

.time-input
  max-width 80px
  margin-right 10px

// Tags
.tag-list
  margin-bottom 20px

.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0

.ui-tag
  .button-close
    &.active
      transform rotate(45deg)
  &.used
    background-color #444ce0
    color #fff
    .button-close
      &:before,
      &:after
        background-color #fff

// Tag Menu Show
.tag-list--menu
  display flex
  justify-content space-between
  align-items center

//New Tag Input
.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px

.total-time
  p
    margin-bottom 6px
  span
    margin-right 16px
  .task-input
    max-width 80px
    margin-bottom 28px
    margin-right 10px

//
// Validate
//
.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13.4px
    color #fc5c65
  &.errorInput
    .error
      display block
input
  &.error
    border-color #fc5c65
</style>
