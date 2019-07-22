<template lang="pug">
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        input(
          type="text"
          placeholder="What we will watch?"
          v-model="taskTitle"
          @keyup.enter="newTask"
        )
        textarea(
          type="text"
          placeholder="Description"
          v-model="taskDescription"
          @keyup.enter="newTask"
        )
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

        .tag-list
          .ui-tag__wrapper
            .ui-tag
              span.tag-title Dogs
              span.button-close
</template>

<script>
export default {
  data () {
    return {
      taskTitle: '',
      taskDescription: '',
      taskId: 3,
      whatWatch: 'Film',

      // Total Time
      // Film
      filmHours: 1,
      filmMinutes: 30,
      // Serial
      serialSeasons: 1,
      serialSeries: 11,
      serialSeriesMinutes: 40
    }
  },
  methods: {
    newTask () {
      if (this.taskTitle === '') {
        return
      }
      let time
      if (this.whatWatch === 'Film') {
        time = this.filmTime
      } else {
        time = this.serialTime
      }
      const task = {
        id: this.taskId,
        title: this.taskTitle,
        description: this.taskDescription,
        whatWatch: this.whatWatch,
        time,
        completed: false,
        editing: false
      }
      console.log(task)

      // Reset
      this.taskId += 1
      this.taskTitle = ''
      this.taskDescription = ''
    },
    getHoursAndMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      return hours + ' Hours ' + min + ' Minutes'
    }
  },
  computed: {
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
</style>
