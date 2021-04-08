class StretchyHeader {
    constructor(element, options) {
        if (options.moveBody) {
            document.body.style.marginTop = element.offsetHeight + 'px'
        }

        this.element = element

        this.setDelay(options)
        this.initScrollStretchyHeader()
        this.initMobileHeaderAutoShift()
    }

    initScrollStretchyHeader() {
        this.scrollStretchyHeaderListener = () => {
            const headerHeight = this.element.offsetHeight
            const scroll = document.documentElement.scrollTop
            const headerTopShift = +this.element.style.top.slice(0, -2)

            if (this.prevScroll) {
                const scrolled = this.prevScroll - scroll

                this.currentDelay = this.clamp(this.currentDelay - scrolled, this.delay, 0)
    
                if (this.currentDelay <= headerHeight || headerTopShift > -headerHeight || scroll <= headerHeight) {
                    this.element.style.top = this.clamp(headerTopShift + scrolled, 0, -headerHeight) + 'px'
                }
            }

            this.prevScroll = scroll
        }

        window.addEventListener('scroll', this.scrollStretchyHeaderListener)
    }

    initMobileHeaderAutoShift() {
        this.headerTransitionEndListener = () => {
            const headerHeight = this.element.offsetHeight

            if (this.element.classList.contains('header-opened')) {
                this.element.classList.remove('header-opened')
                this.element.style.top = 0
            }

            if (this.element.classList.contains('header-closed')) {
                this.element.classList.remove('header-closed')
                this.element.style.top = -headerHeight + 'px'
            }
        }

        this.element.addEventListener('transitionend', this.headerTransitionEndListener)

        this.touchEndListener = () => {
            const headerHeight = this.element.offsetHeight
            const headerTopShift = +this.element.style.top.slice(0, -2)

            if (headerTopShift < 0 && headerTopShift > -headerHeight) {
                if (-headerTopShift < headerHeight / 2) {
                    this.element.classList.add('header-opened')
                } else {
                    this.element.classList.add('header-closed')
                }
            }
        }
        
        window.addEventListener('touchend', this.touchEndListener)
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
        window.removeEventListener('scroll', this.scrollStretchyHeaderListener)
        this.element.removeEventListener('transitionend', this.headerTransitionEndListener)
        window.removeEventListener('touchend', this.touchEndListener)
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