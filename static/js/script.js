document.getElementById('addTextBtn').addEventListener('click', function () {
	showTextInput()
})

document.getElementById('addButtonsBtn').addEventListener('click', function () {
	showButtonInput()
})

document.getElementById('addImageBtn').addEventListener('click', function () {
	showImageInput()
})

document.getElementById('submitTextBtn').addEventListener('click', function () {
	const textInput = document.getElementById('textInput').value
	if (textInput) {
		addMessage('text', textInput)
		document.getElementById('textInput').value = ''
		showInitialButtons()
	}
})

document
	.getElementById('insertUsernameBtn')
	.addEventListener('click', function () {
		insertUsername()
	})

document
	.getElementById('backBtnFromText')
	.addEventListener('click', function () {
		clearTextInput()
		showInitialButtons()
	})

document
	.getElementById('backBtnFromButtons')
	.addEventListener('click', function () {
		clearButtonInputs()
		showInitialButtons()
	})

document
	.getElementById('backBtnFromImage')
	.addEventListener('click', function () {
		clearImageInputs()
		showInitialButtons()
	})

document
	.getElementById('submitImageBtn')
	.addEventListener('click', function () {
		const fileInput = document.getElementById('imageFileInput')
		const urlInput = document.getElementById('imageUrlInput')
		const nameInput = document.getElementById('imageNameInput')

		if (fileInput.files.length > 0) {
			const file = fileInput.files[0]
			uploadImage(file, nameInput.value)
		} else if (urlInput.value) {
			downloadImage(urlInput.value, nameInput.value)
		}

		clearImageInputs()
		showInitialButtons()
	})

document
	.getElementById('addNewButtonInputBtn')
	.addEventListener('click', function () {
		addNewButtonInput()
	})

document
	.getElementById('submitButtonsBtn')
	.addEventListener('click', function () {
		submitButtons()
	})

function showTextInput() {
	document.getElementById('initialButtons').style.display = 'none'
	document.getElementById('textInputContainer').style.display = 'block'
}

function showButtonInput() {
	document.getElementById('initialButtons').style.display = 'none'
	document.getElementById('buttonInputContainer').style.display = 'block'
}

function showImageInput() {
	document.getElementById('initialButtons').style.display = 'none'
	document.getElementById('imageInputContainer').style.display = 'block'
}

function showInitialButtons() {
	document.getElementById('initialButtons').style.display = 'block'
	document.getElementById('textInputContainer').style.display = 'none'
	document.getElementById('buttonInputContainer').style.display = 'none'
	document.getElementById('imageInputContainer').style.display = 'none'
}

function clearTextInput() {
	document.getElementById('textInput').value = ''
}

function clearButtonInputs() {
	const buttonInputsContainer = document.getElementById('buttonInputs')
	buttonInputsContainer.innerHTML = ''
	addNewButtonInput()
}

function clearImageInputs() {
	document.getElementById('imageFileInput').value = ''
	document.getElementById('imageUrlInput').value = ''
	document.getElementById('imageNameInput').value = ''
}

function insertUsername() {
	const textInput = document.getElementById('textInput')
	const currentValue = textInput.value
	if (currentValue && !currentValue.endsWith(' ')) {
		textInput.value += ' '
	}
	textInput.value += 'User '
}

function addNewButtonInput() {
	const buttonInputsContainer = document.getElementById('buttonInputs')
	const newInputContainer = document.createElement('div')
	newInputContainer.classList.add('button-input-container')

	const newInput = document.createElement('input')
	newInput.type = 'text'
	newInput.placeholder = 'Название кнопки'
	newInput.classList.add('button-input')

	newInputContainer.appendChild(newInput)

	if (buttonInputsContainer.children.length > 0) {
		const deleteButton = document.createElement('button')
		deleteButton.innerText = 'Удалить'
		deleteButton.classList.add('delete-button')
		deleteButton.addEventListener('click', function () {
			buttonInputsContainer.removeChild(newInputContainer)
		})
		newInputContainer.appendChild(deleteButton)
	}

	buttonInputsContainer.appendChild(newInputContainer)
}

function submitButtons() {
	const buttonInputs = document.querySelectorAll('.button-input')
	const buttonNames = Array.from(buttonInputs)
		.map(input => input.value)
		.filter(value => value.trim() !== '')

	if (buttonNames.length > 0) {
		addMessage('buttons', buttonNames)
		clearButtonInputs()
		showInitialButtons()
	}
}

function uploadImage(file, name) {
	const formData = new FormData()
	formData.append('image', file, name || file.name)

	fetch('/upload', {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				addMessage('image', `/media/${data.filename}`)
			} else {
				console.error('Failed to upload image:', data.error)
			}
		})
		.catch(error => {
			console.error('Error uploading image:', error)
		})
}

function downloadImage(url, name) {
	const formData = new FormData()
	formData.append('url', url)
	formData.append('name', name || '')

	fetch('/download', {
		method: 'POST',
		body: formData,
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				addMessage('image', `/media/${data.filename}`)
			} else {
				console.error('Failed to download image:', data.error)
			}
		})
		.catch(error => {
			console.error('Error downloading image:', error)
		})
}

function addMessage(type, content = '') {
	const contentArea = document.getElementById('contentArea')
	const message = document.createElement('div')
	message.classList.add('message')

	if (type === 'text') {
		message.innerText = content
	} else if (type === 'buttons') {
		content.forEach(name => {
			const button = document.createElement('button')
			button.innerText = name
			message.appendChild(button)
		})
	} else if (type === 'image') {
		const img = document.createElement('img')
		img.src = content
		message.appendChild(img)
	}

	contentArea.appendChild(message)
}
