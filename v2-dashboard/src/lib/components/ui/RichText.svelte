<script lang="ts">
	let quill: any;

	$effect(() => {
		const editorContainer = document.getElementById('editor');
		const contentInput = document.getElementById('quillContent') as HTMLInputElement;
		const form = document.querySelector('form');

		if (!editorContainer || !contentInput || !form) {
			return;
		}

		quill = new Quill(editorContainer, {
			theme: 'snow'
		});

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

<div id="editor" class="min-h-[20vh]"></div>
<input type="hidden" name="richText" id="quillContent" />
