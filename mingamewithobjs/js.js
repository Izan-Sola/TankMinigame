$(document).ready(function() {
	existingFallingObjs = [];
	existingPlanes = [];
	removedPlanes = [];
	random = new Random.Random();
	$(document).on('keydown', function(k) {

		k.stopPropagation();

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
	});
	$(document).on('keyup', function(k) {
		k.stopPropagation();
		if (k.key == 'ArrowUp' && test == true) {
			shoot()
			setTimeout(testfunc, atkDelay)
			test = false
		}
	});
	$('input').on('mouseup', function(event) {
		if (this.id == 'start') {
			start();
		}
	});
});

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
				leftOffset = 890;
				break
			case 'left':
				leftOffset = 0;
				break
		}
		if (this.type == 'Supplies' || this.type == 'Medic') {

			setTimeout(function() {
				if ($('#' + this.id).css('visibility') != 'hidden') {
					const dropObj = new fallingObjects(this.type, 'support', id, this.topOffset);
					dropObj.createFallingObject()
					existingFallingObjs.push(dropObj)
				}
			}, random.integer(3000, 5000))
		}
		$('.planesContainer').append(`<p style="left: ${leftOffset}px; right: 0px, top: ${this.topOffset}" class="plane ${this.type}" id=${id}> </p>`)
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

		console.log(this.planeType, this.dropType, this.id, this.topOffset)
	}
}


const attributes = {
	type: ['Attacker', 'Bomber', 'Supplies', 'Medic'],
	direction: ['left', 'right'],
	speed: [1, 2, 3]
}

function start() {
    atkDelay = 2000;
    maxHP = 250;
	leftOffset = 0;
	existingPlanes = [];
	t = 0;
	tankOffSet = 0;
	degrees = 0;
    rotationSpeed = 3;
	id = 0;
	bulletId = 0;
	points = 0;
	test = true;
	planeSpawnInterval = 6000;
	mvBulletInterval = setInterval(moveBullet, 100000);
	mvAtkBulletsInterval = setInterval(moveFallingObjects, 100000)
	updateSpawnInterval = setInterval(updatePlanesInterval, 10000)
	spawnInterval = setInterval(spawnPlanes, planeSpawnInterval)
	mvPlaneInterval = setInterval(movePlanes, 40)
	updatePoints = setInterval(upoints, 1000)
	attackerShotInterval = setInterval(attackerShot, 1000)
    checkCollisionsInterval = setInterval(checkCollisions, 100)
	//   mvAtkBulletsInterval = setInterval(moveFallingObjects, 10)
}

function endRound() {

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
	$('.timer-points').html(`<b>Time survived: ${t}, Total points: ${points}</b>`);
}

function spawnPlanes() {

	selectedAttrs = [];
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
		id, topOffset);

	existingPlanes.push(planeObj)
	planeObj.createPlane(id)
}

function shoot() {
	bulletId += 1
	$('.cannon').append(`<p id=bullet${bulletId} class="bullet"></p>`)
	clearInterval(mvBulletInterval)
	mvBulletInterval = setInterval(moveBullet, 5)
}

function moveBullet() {
	$('.bullet').each(function(index, element) {
		mvTop = $(element).css('top')
		mvTop = mvTop.split('px')
		mvTop = parseInt(mvTop[0], 10)
		$(element).css('top', mvTop - 5)
		if (mvTop < -750) {
			$(element).remove();
		}
	});
}

function movePlanes() {

	$(existingPlanes).each(function(index, element) {
  
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

			const rect1 = document.getElementById('bullet' + bulletId).getBoundingClientRect();
			const rect2 = document.getElementById(element.id).getBoundingClientRect();

			const horizontalTouch = rect1.right >= rect2.left && rect1.left <= rect2.right;
			const verticalTouch = rect1.bottom >= rect2.top && rect1.top <= rect2.bottom;

			if (horizontalTouch && verticalTouch) {
				$('#' + element.id).css('visibility', 'hidden');
				points = points + 5
			}
		}
	})
}

function attackerShot() {
	$(existingPlanes).each(function(index, element) {
		setTimeout(function() {
			if (element.type == 'Attacker' && $('#' + element.id).css('visibility') != 'hidden') {
				const dropObj = new fallingObjects(element.type, 'bullet', element.id, element.topOffset);
				dropObj.createFallingObject()
			}
		}, random.integer(1500, 3250))

	})
	clearInterval(mvAtkBulletsInterval)
	mvAtkBulletsInterval = setInterval(moveFallingObjects, 8)

}

function moveFallingObjects() {
	$('.fallingObjectsupport, .fallingObjectbullet').each(function(index, element) {
		mvTopA = 0
		mvTopA = $(element).css('top')
		mvTopA = mvTopA.split('px')
		mvTopA = parseInt(mvTopA[0], 10)
		$(element).css('top', mvTopA + 2)
		if (mvTopA > 400) {
			$(element).remove();
		}
	});
}

function checkCollisions() {

    const tank = document.getElementById('player').getBoundingClientRect();
    
    $('.fallingObjectbullet, .fallingObjectsupport').each(function(index, element) {

        const test = element.getBoundingClientRect();
		const horizontalTouch = tank.right >= test.left && tank.left <= test.right;
		const verticalTouch = tank.bottom >= test.top && tank.top <= test.bottom;

        if(horizontalTouch && verticalTouch) {

            if($(element).hasClass('fallingObjectbullet')) {
                //-hp
                maxHP -= 50
                $('.hp').css('width', maxHP);
                element.remove()
            }
            else if($(element).hasClass('fallingObjectsupport')) {
                    o = random.integer(1, 100)
                    switch (true) {
                        case (o <= 30):
                        atkDelay -= 150
                        $('.alerts').html('<p>Attack speed improved!</p>'); break;

                        case (o = 30 && o <= 60):
                            if(maxHP <= 220) {
                                maxHP += 30
                                $('.hp').css('width', maxHP);
                                $('.alerts').html('<p>Your tanks has been partially repaired!</p>')                
                            }
                            else { $('.hp').css('width', 250); }  break;  
                           
                        case (o > 60 && o <= 85):
                        //cannonrotationspeed
                        rotationSpeed += 0.35
                        $('.alerts').html('<p>The cannon now rotates faster!</p>'); break;

                        case (o > 85):
                        //shieldthattanks1hit
                        $('.alerts').html('<p>You got a shield!</p>'); break;
                    }
                    element.remove()          
            }
        }
    })
}