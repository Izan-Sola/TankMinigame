
$(document).ready(function () {
    existingPlanes = [];
    random = new Random.Random();
    $(document).on('keydown', function (k) {

        k.stopPropagation();

        if (k.key == 'a' && $('.player').css('left') != '8px') {
            tankOffSet -= 8
            $('.player').css('left', tankOffSet)
        }
        if (k.key == 'd' && $('.player').css('left') != '888px') {
            tankOffSet += 8
            $('.player').css('left', tankOffSet)
        }

        //move cannon
        if (k.key == 'ArrowLeft') {
            degrees -= 3
            $('.cannon').css('rotate', degrees + 'deg')
        }
        if (k.key == 'ArrowRight') {
            degrees += 3
            $('.cannon').css('rotate', degrees + 'deg')
        }
    });

    $(document).on('keyup', function (k) {
        k.stopPropagation();
        if (k.key == 'ArrowUp' && test == true) {
            shoot()
            setTimeout(testfunc, 2000)
            test = false
        }
    });

    $('input').on('mouseup', function (event) {

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
        this.type = type;
        this.direction = direction;
        this.speed = speed;
        this.id = id;
        this.topOffset = topOffset;
    }
    createPlane(id) {
        switch (this.direction) {
            case 'right':
                leftOffset = 890; break;
            case 'left':
                leftOffset = 0; break;
        }
        if (this.type == 'Supplies' || 'Medic') {
            setTimeout(function () {
                supportDrops(this.type, this.topOffset, this.id)
            }, random.integer(1000, 4000));
        }
        $('.planesContainer').append(`<p style="left: ${leftOffset}px; right: 0px, top: ${this.topOffset}" class="plane ${this.type}" id=${id}> </p>`)
    }
}

function supportDrops(type, topOffset, id) {

    $('#' + id).append(`<p style="top: ${topOffset}"class=supportDrop${type}></p>`)
}

const attributes = {
    type: ['Attacker', 'Bomber', 'Supplies', 'Medic'],
    direction: ['left', 'right'],
    speed: [1, 2, 3]
}

function start() {
    leftOffset = 0;
    existingPlanes = [];
    t = 0;
    tankOffSet = 0;
    degrees = 0;
    id = 0;
    bulletId = 0;
    points = 0;
    test = true;
    planeSpawnInterval = 6000;
    mvBulletInterval = setInterval(moveBullet, 100000);
    mvAtkBulletsInterval = setInterval(mvAttackerBullets, 100000)
    updateSpawnInterval = setInterval(updatePlanesInterval, 10000)
    spawnInterval = setInterval(spawnPlanes, planeSpawnInterval)
    mvPlaneInterval = setInterval(movePlanes, 40)
    updatePoints = setInterval(upoints, 1000)
    attackerShotInterval = setInterval(attackerShot, 4000)
}
function endRound() {

}

function updatePlanesInterval() {
    clearInterval(spawnInterval)
    if (planeSpawnInterval >= 3000) {
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
    $('.bullet').each(function (index, element) {
        mvTop = $(element).css('top')
        mvTop = mvTop.split('px')
        mvTop = parseInt(mvTop[0], 10)
        $(element).css('top', mvTop - 5
        )
        if (mvTop < -750) {
            $(element).remove();
        }
    });
}

function movePlanes() {

    $(existingPlanes).each(function (index, element) {
        mvSide = $('#' + element.id).css('left')
        mvSide = mvSide.split('px')
        mvSide = parseInt(mvSide[0], 10)

        if (mvSide > 1120 || mvSide < -50) {
            $('#' + element.id).css('visibility', 'hidden')
        }
        if (element.direction == 'left') {
            $('#' + element.id).css('left', mvSide + (3 + (3 * (element.speed / 4))))
        }
        else if (element.direction == 'right') {
            $('#' + element.id).css('left', mvSide - (3 + (3 * (element.speed / 4))))
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
    $(existingPlanes).each(function (index, element) {
        if(element.type == 'Attacker' && $('#'+element.id).css('visibility') != 'hidden') {
        $('.planesContainer').append(`<p style="top: ${element.topOffset}; left: ${$('#' + element.id).css('left')}" id=attackerBullet${element.id} class=attackerBullet></p>`);
        }
    })
    clearInterval(mvAtkBulletsInterval)
    mvAtkBulletsInterval = setInterval(mvAttackerBullets, 10)
}
function mvAttackerBullets() {
    $('.attackerBullet').each(function (index, element) {
        mvTopA = 0
        mvTopA = $(element).css('top')
        mvTopA = mvTopA.split('px')
        mvTopA = parseInt(mvTopA[0], 10)
        $(element).css('top', mvTopA + 3)
        if (mvTopA > 300) {
            $(element).remove();
        }
    });

}



