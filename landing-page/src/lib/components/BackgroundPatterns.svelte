<div class="absolute inset-0 hidden overflow-hidden md:block">
	<div class="pattern-grid"></div>
	<div class="pattern-dots"></div>
</div>

<style>
	.pattern-grid {
		position: absolute;
		inset: -100% -100% -100% -100%;
		background-image: linear-gradient(rgba(244, 63, 94, 0.05) 1px, transparent 1px),
			linear-gradient(90deg, rgba(244, 63, 94, 0.05) 1px, transparent 1px);
		background-size: 3rem 3rem;
		animation: patternMove 20s linear infinite;
	}

	.pattern-dots {
		position: absolute;
		inset: -100% -100% -100% -100%;
		background-image: radial-gradient(rgba(244, 63, 94, 0.1) 1px, transparent 1px);
		background-size: 2rem 2rem;
		animation: patternMove 15s linear infinite reverse;
	}

	@keyframes patternMove {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(50%, 50%);
		}
	}
</style>
