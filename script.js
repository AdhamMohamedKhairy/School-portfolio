'use strict'
class BoxSlider{
    constructor(cardEl){
        this.box = cardEl
        this.track = cardEl.querySelector('.slider-track')
        this.dots = cardEl.querySelector('.dots')
        this.prev = cardEl.querySelector('.slider-arrow.prev')
        this.next = cardEl.querySelector('.slider-arrow.next')
        this.total = this.track.children.length
        this.current = 0

        this._buildDots()
        this._bindArrow()
        if(this.total <= 1){
            this._hideArrows()
        }
    }

    goTo(idx){
        this.current = (idx +this.total) % this.total
        this.track.style.transform = `translateX(-${this.current * 100})`
        this._syncDots()
    }

    _buildDots(){
        for(let i = 0; i < this.total; i++){
            const dot = document.createElement('span')
            dot.className = 'dot' + (i === 0 ? ' active' : '')
            dot.addEventListener('click', e => {
                e.preventDefault()
                e.stopPropagation()
                this.goTo(i)
            })
            this.dots.appendChild(dot)
        }
    }

    _bindArrow(){
        this.prev.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            this.goTo(this.current-1)
        })
        this.next.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            this.goTo(this.current+1)
        })
    }

    _hideArrows(){
        this.prev.style.display = 'none'
        this.next.style.display = 'none'
    }

    _syncDots(){
        this.dots.querySelectorAll('.dot').forEach((d,i) =>
        d.classList.toggle('active', i === this.current))
    }
}

class Gradient{
    constructor(cardEls){
        this.cards = Array.from(cardEls)
        this.apply();
    }

    apply(){
        const total = this.card.length
        this.cards.forEach((card, idx) => {
            const{borderColor, glowColor} = this._colorsAt(idx, total)
            card.style.borderColor = borderColor

            const sliderWrap = card.querySelector('.slider-wrap')
            if(sliderWrap){
                sliderWrap.style.boxShadow = `0 0 0 3px ${borderColor}, 0 0 18px ${glowColor}`
            }
            card.querySelectorAll('.dot').forEach(d => d.style.borderColor = borderColor)
        })
    }

    _colorAt(idx, total){
        const progress = total > 1 ? idx / (total - 1) : 0
        const green = Math.round(255 - progress * (255 - 42))
        const blue = Math.round(65  - progress * (65  - 10))
        const glowAlpha = Math.max(0.1, 0.5 - progress * 0.4)
        return {
        borderColor: `rgb(0, ${green}, ${blue})`,
        glowColor:   `rgba(0, ${green}, ${blue}, ${glowAlpha})`,
        }
    }
}

class Scroll{
    constructor(cardEls){
        this.observer =  new IntersectionObserver(
            entries => this._onInterstect(entries),
            {threshold:0.15}
        )
        cardEls.forEach(c => this.observer.observe(c))
    }

    _onInterstect(entries){
        entries.forEach(entry =>{
            if(entry.isIntersecting){
                entry.target.classList.add('visible')
                this.observer.unobserve(entry.target)
            }
        })
    }
}

class Layout{
    static MOBILE_BREAKPOINT = 600;

    constructor(gridEl){
        this.grid = gridEl
        this.place()
        window.addEventListener('resize', () => this.place())
    }

    place(){
        const box =  this.grid.querySelectorAll('.box')
        if(this._isMobile()){
            this._placeMobile()
        }

        else{
            this._placeDesktop()
        }
    }

    _isMobile(){
        return window.innerWidth <= Layout.MOBILE_BREAKPOINT
    }

    _placeDesktop(cards){
        cards.forEach((card, i) => {
            card.style.gridColumn = '1'
            card.style.gridRow = String(i +  1)
            card.removeAttribute('data-side')
        })
    }

    _placeDesktop(cards){
        cards.forEach((card, i) => {
            const isLeft = i % 2 === 0
            card.style.gridColumn =  isLeft ? '1' : '3'
            card.style.gridRow = String(Math.floor(i / 2) +  1)
            card.setAttribute('data-side', isLeft ? 'left' : 'right')
        })
    }
}

class Line{
    constructor(sectionEl, lineEl, gridEl){
        this.section = sectionEl
        this.line = lineEl
        this.grid = gridEl

        this.resize()
        window.addEventListener('resize', () => this.resize())
        window.addEventListener('load', () => this.resize())
    }

    resize(){
        const sectionTop =  this.section.getBoundingClientRect().top + window.scrollY
        const gridBottom =  this.grid.getBoundingClientRect().bottom + window.scrollY
        this.line.style.height = (gridBottom - sectionTop + 20) + 'px'
    }
}

class root{
    constructor(){
        this.gridEl = document.getElementById('boxes')
        this.sectionEl = document.getElementById('everything')
        this.lineEl = document.getElementById('line')
        this.boxEl = document.querySelectorAll('#boxes .box')

        this._init()
    }

    _init(){
        this.layout = new Layout(this.gridEl)
        this.slider = Array.from(this.boxEl).map(c => new BoxSlider(c))
        this.graident = new Gradient(this.boxEl)
        this.fade = new Scroll(this.boxEl)
        this.line = new Line(this.sectionEl, this.lineEl, this.gridEl)
    }
}

document.addEventListener('DOMContentLoaded', () => new root())