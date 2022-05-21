import moment from "moment/min/moment-with-locales"
import AOS from 'aos'
import 'aos/dist/aos.css'

const Mixins = {
  mounted() {
    AOS.init({ })
    moment.updateLocale('id', {
      relativeTime : {
        future: "%s lagi",
        past:   "%s lalu",
      }
    })
  },
  methods: {
    DateFormat(item) {
      return moment(item).locale('id').format('L, LTS')
    },
    NumberFormat(num) {
      return Number(num).toLocaleString()
    },
    countDown(expiredToken) {
      return new Date(expiredToken) - new Date()
    },
  },
}

export default Mixins