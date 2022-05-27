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
    copyNumber() {
      let text = document.getElementById("copy-to-clipboard");
      text.innerHTML = "<i class='uil uil-check-circle'></i> Berhasil Disalin";
      setTimeout(()=> {
        text.innerHTML = "<i class='uil uil-copy-alt'></i> Salin Nomor";
      }, 3000)
      window.navigator.clipboard.writeText(document.getElementById("NumberCode").innerText);
    },
    copyLinkUrl() {
      let text = document.getElementById("copy-to-clipboard");
      text.innerHTML = "<i class='uil uil-check-circle'></i> Berhasil Disalin";
      setTimeout(()=> {
        text.innerHTML = "<i class='uil uil-copy-alt'></i> Salin Link";
      }, 3000)
      window.navigator.clipboard.writeText(window.location.href);
    },
    DateFormat(item) {
      return moment(item).locale('id').format('L, LTS')
    },
    DateFormatExpired(item) {
      return moment(item, 'YYYYMMDD').locale('id').fromNow()
    },
    NumberFormat(num) {
      return Number(num).toLocaleString()
    },
    countDown(expiredToken) {
      return new Date(expiredToken) - new Date()
    },
    progressFunding(now,last){
      const percent = Math.round(now * 100 / last)
      return percent
    },
    ShortText(string){
      let count = 50;
      return string.slice(0, count) + (string.length > count ? "..." : "")
    },
  },
}

export default Mixins