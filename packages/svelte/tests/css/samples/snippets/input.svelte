{#snippet my_snippet()}
  <span>Hello world</span>
{/snippet}

<div>{@render my_snippet()}</div>

<p>
	{#snippet my_snippet()}
		<span>Hello world</span>
	{/snippet}

	<strong>{@render my_snippet()}</strong>
</p>

<style>
	div > span {
		color: green;
	}
	div span {
		color: green;
	}
	div :global(span) {
		color: green;
	}
	p span {
		color: green;
	}
	p .foo {
		color: red;
	}
	span div {
		color: red;
	}
</style>
