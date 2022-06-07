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
    DateFormatWithoutHours(item) {
      return moment(item).locale('id').format('L')
    },
    DateFormatExpired(item) {
      return moment(item, 'YYYYMMDD').locale('id').fromNow()
    },
    NumberFormat(num) {
      return Number(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    countDown(expiredToken) {
      return new Date(expiredToken) - new Date()
    },
    progressFunding(now,last){
      const percent = Math.round(now * 100 / last)
      return percent
    },
    ShortText(string){
      let count = 150;
      return string.slice(0, count) + (string.length > count ? "..." : "")
    },
    ShortProduct(string){
      let count = 20;
      return string.slice(0, count) + (string.length > count ? "..." : "")
    }
  },
}

export default Mixins