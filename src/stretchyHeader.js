{
    const clamp = (num, maxValue, minValue) => {
        if (num <= minValue) {
            return minValue
        }
    
        if (num >= maxValue) {
            return maxValue
        }
    
        return num
    }
    
    class StretchyHeader {
        constructor(element, options) {
            this.element = element
            this.options = options
            this.options.autoShift = options.autoShift || {}
    
            this.setDelay(options.delay)
    
            this.scroll = new StretchyScrollControl()
    
            this.prevHeaderTop = 0
    
            window.addEventListener('scroll', this.scrollStretchyHeader)
    
            if (options.autoShift.type === 'header') {
                window.addEventListener('touchend', this.mobileHeaderAutoShift)
            }
        }
    
        scrollStretchyHeader = () => {
            this.scroll.updateScrolled()
    
            const headerHeight = this.element.offsetHeight
            const headerTopShift = this.element.offsetTop
    
            const prevDelay = this.currentDelay
    
            if (-headerTopShift == headerHeight) {
                let scrollDeflection = 0
                if (this.prevHeaderTop > headerTopShift) {
                    scrollDeflection = (headerHeight + this.prevHeaderTop + this.scroll.prevScrolled)
                }
    
                this.currentDelay = clamp(this.currentDelay - this.scroll.scrolled - scrollDeflection, this.delay, 0)
            } else {
                this.currentDelay = 0
            }
            
            this.updateElementClass()
    
            if (this.currentDelay == 0 || this.scroll.scroll <= headerHeight) {
                let headerDeflection = 0            
                if (headerTopShift + this.scroll.scrolled > headerTopShift && headerTopShift == -headerHeight) {
                    headerDeflection = prevDelay
                }
    
                const newHeaderTopShift = clamp(headerTopShift + this.scroll.scrolled - headerDeflection, 0, -headerHeight)
    
                this.element.style.top = newHeaderTopShift + 'px'
            }
    
            this.scroll.updatePrevValues()
            this.prevHeaderTop = headerTopShift
        }
    
        updateElementClass() {
            const {autoShift} = this.options
            if (autoShift.openedClass && autoShift.closedClass) {
                const headerTopShift = this.element.offsetTop
                const headerHeight = this.element.offsetHeight
                const {scrolled} = this.scroll
        
                if (-headerTopShift == 0 || headerTopShift == -headerHeight) {
                    if (scrolled < 0) {
                        this.element.classList.remove(this.options.autoShift.openedClass)
                    } else {
                        this.element.classList.remove(this.options.autoShift.closedClass)
                    }
                }
            }
        }
    
        mobileHeaderAutoShift = () => {
            const headerHeight = this.element.offsetHeight
            const headerTopShift = this.element.offsetTop
    
            if (headerTopShift <= 0 && headerTopShift >= -headerHeight) {
                if (-headerTopShift < headerHeight / 2) {
                    this.element.classList.add(this.options.autoShift.openedClass)
                } else if (this.scroll.scroll > headerHeight) {
                    this.element.classList.add(this.options.autoShift.closedClass)
                }
            }
        }
    
        setDelay({inPixels, inHeaderHeight}) {
            if (inPixels) {
                this.delay = inPixels
            } else if(inHeaderHeight) {
                this.delay = inHeaderHeight * this.element.offsetHeight
            } else {
                this.delay = 0
            }
    
            this.currentDelay = 0
        }
    
        destroy() {
            window.removeEventListener('scroll', this.scrollStretchyHeader)
            window.removeEventListener('touchend', this.mobileHeaderAutoShift)
        }
    }
    
    
    class StretchyScrollControl {
        constructor() {
            this.prevScrolled = 0
            this.prevScroll = document.documentElement.scrollTop
        }
    
        updateScrolled() {
            this.scroll = document.documentElement.scrollTop
            this.scrolled = this.prevScroll - this.scroll
        }
    
        updatePrevValues() {
            this.prevScrolled = this.scrolled
            this.prevScroll = this.scroll
        }
    }

    if (typeof exports == 'object') {
        module.exports = StretchyHeader
    } else {
        window.StretchyHeader = StretchyHeader
    }
}