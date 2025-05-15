<script lang="ts">
	let quill: any;

	let props = $props();

	$effect(() => {
		const editorContainer = document.getElementById('editor');
		const contentInput = document.getElementById('quillContent') as HTMLInputElement;
		const form = document.querySelector('form');

		if (!editorContainer || !contentInput || !form) {
			return;
		}

		if (!quill) {
			quill = new Quill(editorContainer, {
				theme: 'snow'
			});
		}

		quill.root.innerHTML = props.description || '';

		form.addEventListener('submit', () => {
			const rawHTML = quill.root.innerHTML.trim();

			// Strip tags to detect visible text
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = rawHTML;
			const plainText = tempDiv.textContent?.trim() || '';

			// If only formatting or empty content, treat as empty
			contentInput.value = plainText.length === 0 ? '' : rawHTML;
		});
	});
</script>

<div id="editor" class="min-h-[20vh] rounded-b-lg border border-gray-100"></div>
<input type="hidden" name={props.name} id="quillContent" />

<style>
	#editor {
		border-color: var(--color-gray-200);
	}
</style>
