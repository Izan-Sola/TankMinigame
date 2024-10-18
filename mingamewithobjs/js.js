$(document).ready(function () {
	existingFallingObjs = []
	existingPlanes = []
	removedPlanes = []
	random = new Random.Random()
	$(document).on('keydown', function (k) {

		k.stopPropagation()

		if (k.key == 'a' && $('.player').css('left') != '8px') {
			tankOffSet -= 8
			$('.player').css('left', tankOffSet)
		}
		if (k.key == 'd' && $('.player').css('left') != '888px') {
			tankOffSet += 8
			$('.player').css('left', tankOffSet)
		}
		if (k.key == 'ArrowLeft') {
			degrees -= rotationSpeed
			$('.cannon').css('rotate', degrees + 'deg')
		}
		if (k.key == 'ArrowRight') {
			degrees += rotationSpeed
			$('.cannon').css('rotate', degrees + 'deg')
		}
	})
	$(document).on('keyup', function (k) {
		k.stopPropagation()
		if (k.key == 'ArrowUp' && test == true) {
			shoot()
			setTimeout(testfunc, atkDelay)
			test = false
		}
	})
	$('input').on('mouseup', function (event) {

		if (this.id == 'start') {
			start()
		}
		if (this.id == 'switch-color')

			tankColor = $('.color').css('background-color')

		switch (tankColor) {
			case 'rgb(255, 255, 255)':
				$('.color').css('background-color', 'rgb(99, 38, 38)'); break;
			case 'rgb(99, 38, 38)':
				$('.color').css('background-color', 'rgb(38, 69, 117)'); break;
			case 'rgb(38, 69, 117)':
				$('.color').css('background-color', 'rgb(106, 18, 165)'); break;
			case 'rgb(106, 18, 165)':
				$('.color').css('background-color', 'rgb(255, 255, 255)'); break;
		}
	})
})

function testfunc() {
	test = true
}

class plane {
	constructor(type, direction, speed, id, topOffset) {
		this.type = type
		this.direction = direction
		this.speed = speed
		this.id = id
		this.topOffset = topOffset
	}
	createPlane(id) {
		switch (this.direction) {
			case 'right':
				leftOffset = 890
				break
			case 'left':
				leftOffset = 0
				break
		}
		// if (this.type == 'Supplies' || this.type == 'Medic') {
		// 	switch (true) {
		// 		case (this.type == 'Supplies'):
		// 			drop = 'Supplies'
		// 			break
		// 		case (this.type == 'Medic'):
		// 			drop = 'Medic'
		// 			break
		// 	}
		// 	setTimeout(function () {
		// 		if ($('#' + this.id).css('visibility') != 'hidden') {
		// 			const dropObj = new fallingObjects(this.type, drop, id, this.topOffset)
		// 			dropObj.createFallingObject()
		// 			existingFallingObjs.push(dropObj)
		// 		}
		// 	}, random.integer(3000, 5000))
		// }
		$('.planesContainer').append(`<p style="left: ${leftOffset}px; right: 0px; top: ${this.topOffset}" class="plane ${this.type}" id=${id}> </p>`)
	}
	planeShot(type, id, topOffset){
	
		setInterval(function () {
			if ($('#' + id).css('visibility') != 'hidden') {
				switch (type) {
					case 'Attacker':
						fallingObjType = 'bullet'
						minDelay = 2000;
						maxDelay = 3000; 
						break;
					case 'Bomber':
						fallingObjType = 'bomb'
						minDelay = 3500;
						maxDelay = 4000; 
						break;
					case 'Supplies':
						fallingObjType = 'Supplies'
						minDelay = 4000;
						maxDelay = 6000; 
						break;
					case 'Medic':
						fallingObjType = 'Medic'
						minDelay = 4000;
						maxDelay = 7000; 
						break;
				}
				const dropObj = new fallingObjects(type, fallingObjType, id, topOffset)
				dropObj.createFallingObject()
			}

		}, Math.floor(Math.random() * (maxDelay - 2000 + 1) + 2000))
	}
}

class fallingObjects {
	constructor(planeType, dropType, id, topOffset) {
		this.planeType = planeType
		this.dropType = dropType
		this.id = id
		this.topOffset = topOffset
	}
	createFallingObject() {
		$('.planesContainer').append(`<p style="top: ${this.topOffset}; 
                left: ${$('#' + this.id).css('left')}" 
                id=${this.dropType}${this.id} class=fallingObject${this.dropType}></p>`)
		//console.log(this.planeType, this.dropType, this.id, this.topOffset)
	}
}

const attributes = {
	type: ['Attacker', 'Bomber', 'Supplies', 'Medic'],
	direction: ['left', 'right'],
	speed: [1, 2, 3]
}

function start() {
	minDelay = 0
	maxDelay = 0
	tankColor = ''
	fallingObjType = ''
	drop = ''
	atkDelay = 2000
	maxHP = 250
	leftOffset = 0
	existingPlanes = []
	t = 0
	tankOffSet = 0
	degrees = 0
	rotationSpeed = 3
	id = 0
	bulletId = 0
	points = 0
	test = true
	planeSpawnInterval = 6000
	mvBulletInterval = setInterval(moveBullet, 100000)
	mvAtkBulletsInterval = setInterval(moveFallingObjects, 100000)
	updateSpawnInterval = setInterval(updatePlanesInterval, 10000)
	spawnInterval = setInterval(spawnPlanes, planeSpawnInterval)
	mvPlaneInterval = setInterval(movePlanes, 40)
	updatePoints = setInterval(upoints, 1000)
	//attackerShotInterval = setInterval(attackerShot, 1000)
	checkCollisionsInterval = setInterval(checkCollisions, 100)
	$('.menu').css('visibility', 'hidden')
	   mvAtkBulletsInterval = setInterval(moveFallingObjects, 10)
}

function endRound() {

		$('.round-score').html('');
}

function updatePlanesInterval() {
	clearInterval(spawnInterval)
	if (planeSpawnInterval >= 2000) {
		planeSpawnInterval -= 500
	}
	spawnInterval = setInterval(spawnPlanes, planeSpawnInterval)
}

function upoints() {
	t += 1
	points = points + (t * 0.125)
	$('.timer-points').html(`<b>Time survived: ${t}, Total points: ${points}</b>`)
}

function spawnPlanes() {

	selectedAttrs = []
	id += 1

	for (i = 0; i < 3; i++) {
		randomAttribute = random.integer(0, Object.values(attributes)[i].length - 1)
		selectedAttrs.push(randomAttribute)
	}
	topOffset = random.integer(5, 80)

	if (selectedAttrs[0] == 'Medic' || 'Supplies') {
		if ((random.integer(1, 10) < 7)) {
			selectedAttrs[0] = 0
		}
	}
	const planeObj = new plane(attributes.type[selectedAttrs[0]],
		attributes.direction[selectedAttrs[1]],
		attributes.speed[selectedAttrs[2]],
		id, topOffset)

	existingPlanes.push(planeObj)
	planeObj.createPlane(id)
	planeObj.planeShot(planeObj.type, planeObj.id, planeObj.topOffset)
}

function shoot() {
	bulletId += 1
	$('.cannon').append(`<p id=bullet${bulletId} class="bullet"></p>`)
	clearInterval(mvBulletInterval)
	mvBulletInterval = setInterval(moveBullet, 5)
}

function moveBullet() {
	$('.bullet').each(function (index, element) {
		mvTop = $(element).css('top')
		mvTop = mvTop.split('px')
		mvTop = parseInt(mvTop[0], 10)
		$(element).css('top', mvTop - 5)
		if (mvTop < -750) {
			$(element).remove()
		}
	})
}

function movePlanes() {

	$(existingPlanes).each(function (index, element) {

		mvSide = $('#' + element.id).css('left')
		mvSide = mvSide.split('px')
		mvSide = parseInt(mvSide[0], 10)

		if (!(mvSide > 1120 || mvSide < -50)) {
			if (element.direction == 'left') {
				$('#' + element.id).css('left', mvSide + (3 + (3 * (element.speed / 4))))
			} else if (element.direction == 'right') {
				$('#' + element.id).css('left', mvSide - (3 + (3 * (element.speed / 4))))
			}
		}
		else {
			$('#' + element.id).css('visibility', 'hidden')
		}
		$('#' + element.id).css('top', element.topOffset)

		if (document.getElementById('bullet' + bulletId) != null) {

			const rect1 = document.getElementById('bullet' + bulletId).getBoundingClientRect()
			const rect2 = document.getElementById(element.id).getBoundingClientRect()

			const horizontalTouch = rect1.right >= rect2.left && rect1.left <= rect2.right
			const verticalTouch = rect1.bottom >= rect2.top && rect1.top <= rect2.bottom

			if (horizontalTouch && verticalTouch) {
				$('#' + element.id).css('visibility', 'hidden')
				points = points + 5
			}
		}
	})
}

function attackerShot() {
	clearInterval(mvAtkBulletsInterval)
	mvAtkBulletsInterval = setInterval(moveFallingObjects, 8)
}

function moveFallingObjects() {
	$('.fallingObjectSupplies, .fallingObjectMedic, .fallingObjectbullet, .fallingObjectbomb').each(function (index, element) {
		mvTopA = 0
		mvTopA = $(element).css('top')
		mvTopA = mvTopA.split('px')
		mvTopA = parseInt(mvTopA[0], 10)
		$(element).css('top', mvTopA + 2)
		if (mvTopA > 400) {
			$(element).remove()
		}
	})
}

function checkCollisions() {

	const tank = document.getElementById('player').getBoundingClientRect()

	$('.fallingObjectbullet, .fallingObjectbomb, .fallingObjectSupplies, .fallingObjectMedic').each(function (index, element) {

		const test = element.getBoundingClientRect()
		const horizontalTouch = tank.right >= test.left && tank.left <= test.right
		const verticalTouch = tank.bottom >= test.top && tank.top <= test.bottom

		if (horizontalTouch && verticalTouch) {

			if ($(element).hasClass('fallingObjectbullet') && $('.shield').css('visibility') == 'hidden') {
				maxHP -= 35
				$('.hp').css('width', maxHP)
			}
			else if ($(element).hasClass('fallingObjectbomb') && $('.shield').css('visibility') == 'hidden') {
				maxHp -= 50
				$('.hp').css('width', maxHP)
			}
			else if ($(element).hasClass('fallingObjectbomb') || $(element).hasClass('fallingObjectbullet')) {
				$('.shield').css('visibility', 'hidden')
			}
			if(maxHP <= 0) {
				endRound()
			}
			if ($(element).hasClass('fallingObjectSupplies')) {
				o = random.integer(1, 60)

				switch (true) {
					case (o <= 30):
						atkDelay -= 150
						$('.alerts').html('<p><(Medic drop)> Attack speed improved!</p>'); break;

					case (o > 30 && o <= 60):
						rotationSpeed += 0.35
						$('.alerts').html('<p><(Medic drop)> The cannon now rotates faster!</p>'); break;
				}
			}
			else if ($(element).hasClass('fallingObjectMedic')) {
				o = random.integer(61, 100)
				switch (true) {
					case (o >= 61 && o <= 85):
						if (maxHP <= 220) {
							maxHP += 30
							$('.hp').css('width', maxHP)
							$('.alerts').html('<p><(Supply drop)> Your tanks has been partially repaired!</p>')
						}
						else { $('.hp').css('width', 250) } break;

					case (o > 85):
						$('.shield').css('visibility', 'visible')
						$('.alerts').html('<p><(Supply drop)> You got a shield!</p>'); break;
				}
			}
			element.remove()
		}
	})
}