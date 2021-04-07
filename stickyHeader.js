class StickyHeader {
    constructor(element, options) {
        document.body.style.marginTop = element.offsetHeight + 'px'

        this.element = element

        this.setDelay(options)
        this.initScrollStickyHeader()
    }

    initScrollStickyHeader() {
        window.addEventListener('scroll', () => {
            const headerHeight = this.element.offsetHeight
            const scroll = document.documentElement.scrollTop
            const headerTopShift = +this.element.style.top.slice(0, -2)

            if (this.prevScroll) {
                const scrolled = this.prevScroll - scroll

                this.currentDelay = this.clamp(this.currentDelay - scrolled, this.delay, 0)

                console.log(this.currentDelay);
    
                if (this.currentDelay <= headerHeight || headerTopShift > -headerHeight || scroll <= headerHeight) {
                    this.element.style.top = this.clamp(headerTopShift + scrolled, 0, -headerHeight) + 'px'
                }
            }

            this.prevScroll = scroll
        })
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