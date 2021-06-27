(() => {
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
            this.options = {
                autoShift: {},
                delay: {},
                ...options
            }
    
            this.setDelay(this.options.delay)
    
            this.scroll = new StretchyScrollControl()
            this.shiftStrategy = this.options?.autoShift?.type == 'header' ? new HeaderAutoShift(this) : null
    
            this.prevHeaderTop = 0
    
            window.addEventListener('scroll', this.scrollStretchyHeader)
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
            
            this.shiftStrategy.updateElementClass()
    
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

        open() {
            this.shiftStrategy.open()
        }

        close() {
            this.shiftStrategy.close()
        }

        shift() {
            this.shiftStrategy.shift()
        }
    }

    class HeaderAutoShift {
        constructor(stretchyHeader) {
            this.stretchyHeader = stretchyHeader
            window.addEventListener('touchend', this.shift)
        }

        updateElementClass() {
            const {element} = this.stretchyHeader

            const {autoShift} = this.stretchyHeader.options
            if (autoShift.openedClass && autoShift.closedClass) {
                const headerTopShift = element.offsetTop
                const headerHeight = element.offsetHeight
                const {scrolled} = this.stretchyHeader.scroll
        
                if (-headerTopShift == 0 || headerTopShift == -headerHeight) {
                    if (scrolled < 0) {
                        element.classList.remove(this.stretchyHeader.options.autoShift.openedClass)
                    } else {
                        element.classList.remove(this.stretchyHeader.options.autoShift.closedClass)
                    }
                }
            }
        }

        open() {
            const {element} = this.stretchyHeader
            element.classList.remove(this.stretchyHeader.options.autoShift.closedClass)
            element.classList.add(this.stretchyHeader.options.autoShift.openedClass)
        }

        close() {
            const {element} = this.stretchyHeader
            element.classList.remove(this.stretchyHeader.options.autoShift.openedClass)
            element.classList.add(this.stretchyHeader.options.autoShift.closedClass)
        }
    
        shift = () => {
            const {element} = this.stretchyHeader
            const headerHeight = element.offsetHeight
            const headerTopShift = element.offsetTop
    
            if (headerTopShift <= 0 && headerTopShift >= -headerHeight) {
                if (-headerTopShift < headerHeight / 2) {
                    this.open()
                } else if (this.stretchyHeader.scroll.scroll > headerHeight) {
                    this.close()
                } else {
                    const closingHeader = e => {
                        window.requestAnimationFrame(function scrollWindow() {
                            window.scrollTo(null, -element.offsetTop)
                            // console.log(element.offsetTop);
                            if (element.offsetTop != 0 && element.offsetTop != -headerHeight) {
                                window.requestAnimationFrame(scrollWindow)
                            }
                        })
                    }
                    

                    element.addEventListener('transitionstart', closingHeader)
                    element.addEventListener('transitionend', function transitionEnd() {
                        element.removeEventListener('transitionstart', closingHeader)
                        element.removeEventListener('transitionend', transitionEnd)
                    })

                    this.close()
                }
            }
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
})()