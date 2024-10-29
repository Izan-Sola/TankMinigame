$(document).ready(function () {
	existingFallingObjs = []
	existingPlanes = []
	removedPlanes = []
	random = new Random.Random()
	$(document).on('keydown', function (k) {

		//TODO: Database connection :Zzz:

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
	$('input').on('mousedown', function (event) {
		if (this.id == 'start') { start() }

		if (this.id == 'switch-color') {

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
		}
	})
})

function testfunc() { test = true }

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
		$('.planesContainer').append(`<p style="left: ${leftOffset}px; right: 0px; top: ${this.topOffset}" 
																class="plane ${this.type}" id=${id}> </p>`)
	
		switch (this.type) {
			case 'Attacker':
				fallingObjType = 'bullet'
				delay = [1500, 2000]
				break;
			case 'Bomber':
				fallingObjType = 'bomb'
				delay = [2500, 3000]
				break;
			case 'Supplies':
				fallingObjType = 'Supplies'
				delay = [4000, 6500]
				break;
			case 'Medic':
				fallingObjType = 'Medic'
				delay = [4500, 7000]
				break;
		}
		interval = random.integer(delay[0], delay[1])
	    this.planeShot(this.type, fallingObjType, this.id, this.topOffset, interval, this.direction)
	}
	planeShot(type, fallingObjType, id, topOffset, interval, direction) {

		setInterval(function () {
			if ($('#' + id).css('visibility') != 'hidden') {
				const dropObj = new fallingObjects(type, fallingObjType, id, topOffset, direction)
				dropObj.createFallingObject()
			}
		}, interval)
	}
}

class fallingObjects {
	constructor(planeType, dropType, id, topOffset, direction) {
		this.planeType = planeType
		this.dropType = dropType
		this.id = id
		this.topOffset = topOffset
		this.direction = direction
	}
	createFallingObject() {
		$('.planesContainer').append(`<p style="top: ${this.topOffset}; 
                left: ${$('#' + this.id).css('left')}" 
                id=${this.dropType}${this.id} class="fallingObject${this.dropType} ${this.direction}"></p>`)
		//console.log(this.planeType, this.dropType, this.id, this.topOffset)
	}
}

const attributes = {
	type: ['Attacker', 'Bomber', 'Supplies', 'Medic'],
	direction: ['left', 'right'],
	speed: [1, 2, 3]
	//MAYBE: 
	//bulletDirection: [left, right]
}

function start() {
	interval = 0
	existingCoins = 0
	coinsObtained = 0
	shieldHitCount = 0
	totalDmgTaken = 0
	totalPlanesDestroyed = 0
	totalDmgRepaired = 0
	bulletLeftSpeed = 0
	delay = []
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
	coinSpawnInterval = setInterval(coinSpawn, 5000)
	mvBulletInterval = setInterval(moveBullet, 100000)
	mvAtkBulletsInterval = setInterval(moveFallingObjects, 100000)
	updateSpawnInterval = setInterval(updatePlanesInterval, 10000)
	spawnInterval = setInterval(spawnPlanes, planeSpawnInterval)
	mvPlaneInterval = setInterval(movePlanes, 40)
	updatePoints = setInterval(upoints, 1000)
	//attackerShotInterval = setInterval(attackerShot, 1000)
	checkCollisionsInterval = setInterval(checkCollisions, 40)
	mvAtkBulletsInterval = setInterval(moveFallingObjects, 10)
	$('.menu').css('visibility', 'hidden')
}

function endRound() {
	clearInterval(mvBulletInterval)
	clearInterval(mvAtkBulletsInterval)
	clearInterval(updateSpawnInterval)
	clearInterval(spawnInterval)
	clearInterval(mvPlaneInterval)
	clearInterval(updatePoints)
	clearInterval(checkCollisionsInterval)
	clearInterval(mvAtkBulletsInterval)

	$('.menu').css('visibility', 'visible')
	$('.menu').prepend(`<ul class="round-stats">
						<li> Points earned: ${points + (points * (coinsObtained / 12))} </li>
						<li> Time survived: ${t} </li>
						<li> Coins obtained: ${coinsObtained} </li>
						<li> Planes taken down: ${totalPlanesDestroyed} </li>
						<li> Total damage repaired: ${totalDmgRepaired} </li>
						<li> Hits taken by shields: ${shieldHitCount} </li>
						<li> Total damage taken: ${totalDmgTaken} </li>
					 </u>`)
	$('.menu').css('visibility', 'visible');
}

function coinSpawn() {
	if (existingCoins < 2) $('.container').append(`<p class="coin" style="left: ${random.integer(0, 1000)}px; "></p>`)
}

function updatePlanesInterval() {
	clearInterval(spawnInterval)
	if (planeSpawnInterval >= 2000) planeSpawnInterval -= 500
	spawnInterval = setInterval(spawnPlanes, planeSpawnInterval)
}

function upoints() {
	t += 1
	points = points + (t * 0.125)
	$('.timer-points').html(`<b>Time survived: ${t}, Total points: ${points}, 
										Coins obtained: ${coinsObtained}</b>`)
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
		if ((random.integer(1, 10) < 8)) selectedAttrs[0] = random.integer(0, 1)
	}
	const planeObj = new plane(attributes.type[selectedAttrs[0]],
		attributes.direction[selectedAttrs[1]],
		attributes.speed[selectedAttrs[2]],
		id, topOffset)

	existingPlanes.push(planeObj)
	planeObj.createPlane(id)}

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
			if (element.direction == 'left') $('#' + element.id).css('left', mvSide + (3 + (3 * (element.speed / 4))))
			else if (element.direction == 'right') $('#' + element.id).css('left', mvSide - (3 + (3 * (element.speed / 4))))
		}

		else { $('#' + element.id).css('visibility', 'hidden') }

		$('#' + element.id).css('top', element.topOffset)

		if (document.getElementById('bullet' + bulletId) != null) {

			const rect1 = document.getElementById('bullet' + bulletId).getBoundingClientRect()
			const rect2 = document.getElementById(element.id).getBoundingClientRect()

			const horizontalTouch = rect1.right >= rect2.left && rect1.left <= rect2.right
			const verticalTouch = rect1.bottom >= rect2.top && rect1.top <= rect2.bottom

			if (horizontalTouch && verticalTouch) {
				$('#' + element.id).css('visibility', 'hidden')
				$('#bullet' + bulletId).remove();
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
	$(`.fallingObjectSupplies, .fallingObjectMedic, 
		.fallingObjectbullet, .fallingObjectbomb`).each(function (index, element) {

		mvTopA = 0
		mvTopA = $(element).css('top')
		mvTopA = mvTopA.split('px')
		mvTopA = parseInt(mvTopA[0], 10)

		if ($(element).hasClass('fallingObjectbullet') || $(element).hasClass('fallingObjectbomb')) {
			mvLeftA = 0
			mvLeftA = $(element).css('left')
			mvLeftA = mvLeftA.split('px')
			mvLeftA = parseInt(mvLeftA[0], 10)

			switch (true) {
				case ($(element).hasClass('fallingObjectbullet')): bulletLeftSpeed = 2; break;
				case ($(element).hasClass('fallingObjectbomb')): bulletLeftSpeed = 1; break;
			}

			if ($(element).hasClass('left')) $(element).css('left', mvLeftA + bulletLeftSpeed)
			else $(element).css('left', mvLeftA - bulletLeftSpeed)

		}
		$(element).css('top', mvTopA + 3.5)

		if (mvTopA > 400) {
			if ($(element).hasClass('fallingObjectbomb'))
				playExplosionGif(element)
			else $(element).remove()
		}
	})
}

function playExplosionGif(element) {

	$('.fallingObjectbomb').replaceWith(`<img class="explosion" src="imgs/explosion.gif">`)
	$('.explosion').css('left', $(element).css('left'))

	setTimeout(function () {
		$('.explosion').each(function (index, element) {
			$(element).remove()
		})}, 1000)
}

function checkCollisions() {

	const tank = document.getElementById('player').getBoundingClientRect()

	$(`.explosion, .coin, .fallingObjectbullet, 
	   .fallingObjectbomb, .fallingObjectSupplies, 
	   .fallingObjectMedic`).each(function (index, element) {

		const test = element.getBoundingClientRect()
		const horizontalTouch = tank.right >= test.left && tank.left <= test.right
		const verticalTouch = tank.bottom >= test.top && tank.top <= test.bottom

		if (horizontalTouch && verticalTouch) {

			if ($(element).hasClass('fallingObjectbullet') && $('.shield').css('visibility') == 'hidden') {
				maxHP -= 35
				totalDmgTaken += 35
				$('.hp').css('width', maxHP)
			}
			else if ($(element).hasClass('fallingObjectbomb') && $('.shield').css('visibility') == 'hidden') {
				maxHP -= 50
				totalDmgTaken += 50
				$('.hp').css('width', maxHP)
			}
			else if ($(element).hasClass('fallingObjectbomb') || $(element).hasClass('fallingObjectbullet')) {
				shieldHitCount += 1
				$('.shield').css('visibility', 'hidden')
			}
			if (maxHP <= 0) { endRound() }

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
							$('.alerts').html('<p><(Supply drop)> Your tank has been partially repaired!</p>')
							totalDmgRepaired += 30
						}
						else { $('.hp').css('width', 250) } break;
					case (o > 85):
						$('.shield').css('visibility', 'visible')
						$('.alerts').html('<p><(Supply drop)> You obtained a shield!</p>'); break;
				}
			}
			if ($(element).hasClass('explosion')) {
				maxHP -= 25
				totalDmgTaken += 25
				$('.hp').css('width', maxHP)
			}
			if ($(element).hasClass('coin')) {
				existingCoins -= 1
				coinsObtained += 1
			}
			if (!$(element).hasClass('explosion')) element.remove()
		}
	})
}