import { useEffect, useRef } from 'react'

class BallPhysics {
	x: number
	y: number
	vx: number
	vy: number
	radius: number
	color: string
	element: HTMLElement
	container: HTMLDivElement
	gravity: number
	friction: number
	bounce: number

	constructor(
		container: HTMLDivElement,
		x: number,
		y: number,
		vx: number,
		vy: number,
		radius: number,
		color: string,
		gravity: number,
		friction: number,
		bounce: number
	) {
		this.container = container
		this.x = x
		this.y = y
		this.vx = vx
		this.vy = vy
		this.radius = radius
		this.color = color
		this.gravity = gravity
		this.friction = friction
		this.bounce = bounce
		this.element = document.createElement('div')
		this.element.style.position = 'absolute'
		this.element.style.borderRadius = '50%'
		this.element.style.width = radius * 2 + 'px'
		this.element.style.height = radius * 2 + 'px'
		this.element.style.background = color
		this.element.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
		this.element.style.left = x + 'px'
		this.element.style.top = y + 'px'
		container.appendChild(this.element)
	}

	update() {
		this.vy += this.gravity
		this.x += this.vx
		this.y += this.vy
		this.vx *= this.friction
		this.vy *= this.friction

		const maxX = this.container.clientWidth - this.radius * 2
		const maxY = this.container.clientHeight - this.radius * 2

		if (this.x <= 0) {
			this.x = 0
			this.vx *= -this.bounce
		}
		if (this.x >= maxX) {
			this.x = maxX
			this.vx *= -this.bounce
		}
		if (this.y <= 0) {
			this.y = 0
			this.vy *= -this.bounce
		}
		if (this.y >= maxY) {
			this.y = maxY
			this.vy *= -this.bounce
		}

		this.element.style.left = this.x + 'px'
		this.element.style.top = this.y + 'px'
	}
}

export default function BouncingBalls() {
	const containerRef = useRef<HTMLDivElement>(null)
	const ballsRef = useRef<BallPhysics[]>([])
	const animationIdRef = useRef<number | null>(null)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const gravity = 0.5
		const friction = 0.99
		const bounce = 0.85
		const balls = ballsRef.current

		const createBall = () => {
			const radius = Math.random() * 15 + 10
			const x = Math.random() * (container.clientWidth - radius * 2)
			const y = Math.random() * (container.clientHeight * 0.01)
			const vx = (Math.random() - 0.5) * 8
			const vy = Math.random() * 2
			const colors = [
				'var(--lavender-500)',
				'var(--orange-500)',
				'var(--pink-500)',
				'var(--lime-400)',
				'var(--white-400)',
			]
			const color = colors[Math.floor(Math.random() * colors.length)]

			balls.push(
				new BallPhysics(
					container,
					x,
					y,
					vx,
					vy,
					radius,
					color,
					gravity,
					friction,
					bounce
				)
			)
		}

		const animate = () => {
			balls.forEach((ball) => ball.update())
			animationIdRef.current = requestAnimationFrame(animate)
		}

		for (let i = 0; i < 5; i++) {
			createBall()
		}

		intervalRef.current = setInterval(createBall, 2000)

		animate()

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current)
			}
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
			balls.forEach((ball) => ball.element.remove())
			balls.length = 0
		}
	}, [])

	return (
		<div
			ref={containerRef}
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0,
			}}
		/>
	)
}
