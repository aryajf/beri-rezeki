<template>
    <div>
        <!-- MODAL -->
        <div class="modal fade" ref="redirectModal" id="redirectModal" tabindex="-1" aria-labelledby="redirectModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="redirectModalLabel">Cek pembayaran</h5>
                        <button ref="modalClose" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Pindah ke pembayaran <template v-if="activePayment.title">{{activePayment.title}}</template>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn bg-ed btn-sm d-flex" @click="redirectPayment()" v-if="activePayment.link" data-bs-dismiss="modal">
                            Go to page <i class="uil uil-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class='calendar'>
            <div class='calendar-main'>
                <FullCalendar :events="payments.payments" class='calendar-calendar' :options='calendarOptions'>

                    <template v-slot:eventContent='arg'>
                        <b>{{ arg.timeText }}</b>
                        <i>{{ arg.event.title }}</i>
                    </template>
                </FullCalendar>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import '@fullcalendar/core/vdom'
import '@fullcalendar/core'
import FullCalendar from 'primevue/fullcalendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Mixins from '@/mixins'
import { Modal } from 'bootstrap'

export default {
    mixins: [Mixins],
    components: { FullCalendar },
    computed: {
        ...mapGetters({
            btnLoading: 'btnLoading',
            payments: 'payments/all_payments',
        }),
    },
    data: function () {
        return {
            activePayment: {
                title: null,
                type: null,
                link: null,
            },
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                },
                initialView: 'dayGridMonth',
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                navLinks: true,
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents,
            },
        }
    },
    created() {
        this.getAllPayments()
    },
    methods: {
        getAllPayments() {
            this.$store.dispatch('payments/getAllPayments')
        },
        redirectPayment() {
            this.$router.push(
                `/${this.activePayment.type}/accepted/${this.activePayment.link}`
            )
        },
        handleDateSelect(selectInfo) {
            let calendarApi = selectInfo.view.calendar
            calendarApi.unselect() // clear date selection
        },
        handleEventClick(clickInfo) {
            var myModal = new Modal(this.$refs.redirectModal, {
                keyboard: false,
            })
            myModal.show()
            this.activePayment.title = clickInfo.event.title
            this.activePayment.type = clickInfo.event.title
                .split(' |')[0]
                .toLowerCase()
            this.activePayment.link = clickInfo.event.id
        },
    },
}
</script>
<style lang="scss">
.fc {
    /* the calendar root */
    max-width: 1100px;
    margin: 0 auto;
    .fc-popover {
        z-index: 1000;
    }
    .fc-daygrid-event {
        background-color: #6fbf73;
        border: 0;
    }
    .fc-daygrid-event-dot {
        border: 4px solid #357a38 !important;
    }
    .fc-event.fc-daygrid-dot-event {
        color: #fff;
    }
    .fc-daygrid-event-harness {
        cursor: pointer;
    }
    .fc-daygrid-day-number,
    .fc-daygrid-more-link,
    .fc-col-header-cell-cushion {
        text-decoration: none;
    }
}

@media screen and (max-width: 960px) {
    .fc-header-toolbar {
        display: flex;
        flex-wrap: wrap;
    }
}

.calendar h2 {
    margin: 0;
    font-size: 16px;
}
.calendar ul {
    margin: 0;
    padding: 0 0 0 1.5em;
}
.calendar li {
    margin: 1.5em 0;
    padding: 0;
}
.calendar b {
    /* used for event dates/times */
    margin-right: 3px;
}
.calendar {
    display: flex;
    min-height: 100%;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
    font-size: 14px;
}
.calendar-main {
    flex-grow: 1;
    padding: 3em;
}
</style>