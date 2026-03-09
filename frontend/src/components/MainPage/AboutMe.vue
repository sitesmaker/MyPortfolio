<template>
    <section>
        <div class="container">
            <div class="about-me">
                <div class="about-me__media">
                    <img src="../../assets/about-me-photo.jpg" alt="">
                </div>
                <div class="about-me__content">
                    <h2>Обо мне</h2>   
                    <p>
                        5&nbsp;лет в&nbsp;топовых компаниях.
                        Я&nbsp;разрабатывал веб-приложения для крупных заказчиков.
                        Многие проекты проходили по&nbsp;NDA(соглашение о&nbsp;неразглашении), поэтому их нет в&nbsp;открытом доступе.
                    </p>
                    <p>
                        Это&nbsp;минус? Нет,&nbsp;это&nbsp;плюс.
                        Я&nbsp;прошел жесткую школу коммерческой разработки, работал в&nbsp;сильных командах и&nbsp;видел, как&nbsp;строятся сложные системы. 5&nbsp;лет&nbsp;опыта, который джуны только мечтают получить.
                    </p>
                    <p>
                        Сейчас я&nbsp;выхожу с&nbsp;небольшим портфолио, но&nbsp;<span>огромным багажом знаний.</span>
                        Мое&nbsp;портфолио начнется с&nbsp;твоего проекта.
                    </p>
                    <p>
                        🚀 Ну что, погнали?
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.about-me {
    display: flex;
    column-gap: 40px;
    
    &__content {
        max-width: 640px;
    }

    &__media {
        max-width: 400px;
        height: auto;
        border: 3px solid var(--accent-color);
        overflow: hidden;
         
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(75%);
        }
    }
}
</style>