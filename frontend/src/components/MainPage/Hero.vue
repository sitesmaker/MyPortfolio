<template>
    <div class="hero">
        <div class="hero__wrapper">
            <div class="hero__content">
                <h1>
                    Fullstack разработчик <br>
                    <span class="accent">Филимоненков Юрий</span>
                </h1>
                <div class="hero__content-description">
                    Fullstack-разработчик с 5-летним опытом создания веб-приложений. 
                    Специализируюсь на современных технологиях и архитектурных решениях. 
                    Работал как в продуктовых компаниях, так и на фрилансе — 
                    умею находить подход к разным задачам и заказчикам.
                </div>
                <button class="btn btn--gradient">Связаться со мной</button>
            </div>
            <div class="hero__photo">
                <div class="hero__photo-image">
                    <img src="../../assets/photo.png" alt="Моё фото">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes rotate {
    0% {
        transform: rotateY(0);
    }
    100% {
        transform: rotateY(360deg);
    }
}

.hero {
    padding: 100px 0;

    &__wrapper {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 40px 40px 0 80px;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 70%;
            background: linear-gradient(232.96deg, #17171A 27.06%, rgba(23, 23, 26, 0) 92.12%);
        }

        &::before {
            content: "";
            position: absolute;
            bottom: -5%;
            left: 40px;
            width: calc(100% - 20px);
            height: 70%;
            background: transparent;
            border: 2px solid #171719;
        }
    }

    &__photo {
        width: 450px;
        position: relative;
        z-index: 10;

        &::after {
            content: '';
            position: absolute;
            top: -60px;
            left: 40px;
            width: 58px;
            height: 58px;
            background: url(../../assets/first-blok-figura-1.png) no-repeat;
            background-size: contain;
            animation: pulse 3s infinite;
        }

        &::before {
            content: '';
            position: absolute;
            top: 40px;
            right: -40px;
            width: 52px;
            height: 52px;
            background: url(../../assets/first-blok-figura-2.png) no-repeat;
            background-size: contain;
            animation: rotate 4s linear infinite;
        }

        &-image {
            display: flex;
            position: relative;

            img {
                width: 100%;
                height: auto;
                filter: grayscale(100%);
            }

            &::after {
                content: '';
                position: absolute;
                bottom: 50px;
                left: -20px;
                width: 52px;
                height: 52px;
                background: url(../../assets/photo-figura-1.png) no-repeat;
                background-size: contain;
                animation: pulse 2s infinite;
            }
        }
    }

    &__content {
        position: relative;
        z-index: 10;
        margin-bottom: auto;
        
        &-description {
            max-width: 500px;
            font-size: 1.15rem;
            line-height: 22px;
            color: rgba(230, 230, 230, 0.51);
            padding-top: 20px;
        }

        .btn {
            margin-top: 20px;
        }
    }
}
</style>