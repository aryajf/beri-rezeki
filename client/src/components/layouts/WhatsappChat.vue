<template>
    <div>
        <transition name="fade">
            <div @click="toggleChat" v-show="!whatsappDisplay" class="whatsappChat" :class="{'whatsappChatPosition': announcement != null}">
                <div class="whatsappChatButton fs-2">
                    <i class="uil uil-whatsapp"></i>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div v-show="whatsappDisplay" class="whatsappChat">
                <div class="whatsappChatContainer" :class="{'whatsappChatPosition': announcement != null}">
                    <div class="whatsappChatHeader">
                        <div class="d-flex justify-content-between align-items-center">
                            <i class="uil uil-whatsapp"></i>
                            <div>Hubungi Kami</div>
                            <div class="whatsappChatHeaderClose" @click="toggleChat"></div>
                        </div>
                    </div>
                    <div class="whatsappChatBody">
                        <div class="whatsappChatMessage">
                            <b>Assalamu'alaikum</b><br>
                            Selamat datang di <b>Beri Rezeki</b>, ada yang bisa kami bantu?
                        </div>
                        <div class="whatsappChatContainerButton text-end">
                            <a @click="toggleChat" target="_blank" href="https://api.whatsapp.com/send?phone=+628979243010">
                                <button class="btn text-white">Buka Pesan <i class="uil uil-message ms-1"></i></button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ['announcement'],
    data() {
        return {
            whatsappDisplay: false,
        }
    },
    methods: {
        toggleChat() {
            this.whatsappDisplay = !this.whatsappDisplay
        },
    },
}
</script>

<style lang="scss">
@import '@/assets/sass/variables';
.fade-enter-active {
    animation: fade-in 0.5s;
}
.fade-leave-active {
    animation: fade-in 0.5s reverse;
}

@keyframes fade-in {
    0% {
        opacity: 0;
        transform: scale(0);
        transform-origin: bottom right;
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.whatsappChat {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
    .whatsappChatContainer {
        transition: all 3s ease-out;
        border-radius: 10px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        position: relative;
        width: 27.5rem;
        .whatsappChatHeader {
            color: #fff;
            border-radius: 10px 10px 0 0;
            font-size: 20px;
            padding: 5px 20px;
            box-sizing: border-box;
            background-color: #25d366;
            i {
                color: #fff;
                position: relative;
                text-align: center;
                font-size: 30px;
            }
            .whatsappChatHeaderClose {
                width: 30px;
                height: 30px;
                background: rgba(0, 0, 0, 0.4)
                    url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E %3Cpath d='M24 2.4L21.6 0 12 9.6 2.4 0 0 2.4 9.6 12 0 21.6 2.4 24l9.6-9.6 9.6 9.6 2.4-2.4-9.6-9.6L24 2.4z'/%3E %3C/svg%3E")
                    50% no-repeat;
                background-size: 12px;
                cursor: pointer;
                border-radius: 100%;
                transition: background-color 0.3s ease-out;

                &:hover {
                    background-color: rgba(0, 0, 0, 0.6);
                }
            }
        }
        .whatsappChatBody {
            border-radius: 0 0 10px 10px;
            padding: 20px;
            box-sizing: border-box;
            background-color: #f6fdf9;
            .whatsappChatMessage {
                position: relative;
                padding: 15px 20px;
                box-sizing: border-box;
                margin-bottom: 20px;
                border-radius: 10px;
                background: #fff;
                color: $darkBlue;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
                transform: translateZ(0);
                &::before {
                    box-sizing: border-box;
                    content: '';
                    display: block;
                    position: absolute;
                    bottom: 20px;
                    left: -15px;
                    width: 17px;
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-right: 25px solid #fff;
                }
            }
            a {
                text-decoration: none;
                button {
                    text-decoration: none;
                    background-color: #25d366;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
                    border: #25d366;
                    border-radius: 10px;
                    &:hover {
                        background-color: #10c753;
                    }
                }
            }
        }
    }
    .whatsappChatButton {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        position: relative;
        cursor: pointer;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background-color: #25d366;
        transition: all 0.1s ease-out;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;

        &:hover {
            background-color: #10c753;
        }
    }
}
@media screen and (max-width: 768px) {
    .whatsappChat {
        bottom: 1rem;
        right: 1rem;

        .whatsappChatContainer {
            width: 97.5%;
            margin-left: 2.5%;
        }
    }

    .whatsappChatPosition {
        bottom: 4.5rem;
    }
}
</style>