class StretchyHeader {
    constructor(element, options) {
        if (options.moveBody) {
            document.body.style.marginTop = element.offsetHeight + 'px'
        }

        this.element = element

        this.setDelay(options)

        this.scroll = {
            prevScroll: null,
            scroll: null,
            scrolled: null
        }

        window.addEventListener('scroll', this.scrollStretchyHeader)
        window.addEventListener('touchend', this.mobileHeaderAutoShift)
    }

    scrollStretchyHeader = () => {
        const headerHeight = this.element.offsetHeight

        this.scroll.scroll = document.documentElement.scrollTop

        this.updateElementClass()

        const headerTopShift = +this.element.style.top.slice(0, -2)

        if (this.scroll.prevScroll) {
            this.scroll.scrolled = this.scroll.prevScroll - this.scroll.scroll

            this.currentDelay = this.clamp(this.currentDelay - this.scroll.scrolled, this.delay, 0)

            if (this.currentDelay <= headerHeight || headerTopShift > -headerHeight || this.scroll.scroll <= headerHeight) {
                this.element.style.top = this.clamp(headerTopShift + this.scroll.scrolled, 0, -headerHeight) + 'px'
            }
        }

        this.scroll.prevScroll = this.scroll.scroll
    }

    updateElementClass() {
        this.element.style.top = this.element.offsetTop + 'px'
        const {scrolled} = this.scroll

        if (scrolled < 0) {
            this.element.classList.remove('header-opened')
        }

        if (scrolled > 0 && this.currentDelay <= 0) {
            this.element.classList.remove('header-closed')
        }
    }

    mobileHeaderAutoShift = () => {
        const headerHeight = this.element.offsetHeight
        const headerTopShift = +this.element.style.top.slice(0, -2)

        if (headerTopShift <= 0 && headerTopShift >= -headerHeight) {
            if (-headerTopShift < headerHeight / 2) {
                this.element.classList.add('header-opened')
            } else {
                this.element.classList.add('header-closed')
            }
        }
    }

    setDelay({delayInPixels, delayInHeaderWidth}) {
        if (delayInPixels) {
            this.delay = delayInPixels
        } else if(delayInHeaderWidth) {
            this.delay = delayInHeaderWidth * this.element.offsetHeight
        } else {
            this.delay = 0
        }

        this.currentDelay = 0
    }

    destroy() {
        window.removeEventListener('scroll', this.scrollStretchyHeader)
        window.removeEventListener('touchend', this.mobileHeaderAutoShift)
    }

    clamp(num, maxValue, minValue) {
        if (num <= minValue) {
            return minValue
        }
    
        if (num >= maxValue) {
            return maxValue
        }

        return num
    }
}