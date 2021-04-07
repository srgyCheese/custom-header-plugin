class StickyHeader {
    constructor(element, {delayInPixels}) {
        document.body.style.marginTop = element.offsetHeight + 'px'
        
        window.onscroll = () => {
            const scroll = document.documentElement.scrollTop

            const headerTop = +element.style.top.slice(0, -2)

            const scrolled =  this.prevScroll - scroll

            if (scrolled >= 0) {
                this.delay -= scrolled
            } else {
                this.delay = delay
            }

            if (this.delay <= 0 || headerTop > -element.offsetHeight || scroll <= element.offsetHeight) {
                element.style.top = this.clamp(headerTop + scrolled, 0, -element.offsetHeight) + 'px'
            }

            this.prevScroll = document.documentElement.scrollTop
        }
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