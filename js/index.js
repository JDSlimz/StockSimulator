var distanceFromBuy;
var distanceFromSell;
var direction;
var modifier;
var currentValue = 0;

const data = {
    labels: [],
    datasets: [{
        label: 'Market Value',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Your Favorite Stock'
            }
        },
        animation: {
            duration: 0
        }
    },
};

(function () {

    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );


    document.onmousemove = handleMouseMove;

    function handleMouseMove(event) {
        var eventDoc, doc, body;
        var buyBtn = getButtonCetner('buy');
        var sellBtn = getButtonCetner('sell');

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        distanceFromBuy = calculateDistance($('#buy'), event.pageX, event.pageY);
        distanceFromSell = calculateDistance($('#sell'), event.pageX, event.pageY);
    }

    window.setInterval(function () {
        updateGraph(myChart);
    }, 500);
})();

function getButtonCetner(button) {
    const btn = document.getElementById(button);
    const {
        left,
        top,
        width,
        height
    } = btn.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    return {
        x: centerX,
        y: centerY
    };
}

function updateGraph(myChart) {
    if (distanceFromBuy > distanceFromSell) {
        //Closer to sell
        modifier = convertRange(distanceFromSell, [0, screen.width], [1000, 0]) * -1;
    } else {
        //Closer to buy
        modifier = convertRange(distanceFromBuy, [0, screen.width], [100, 0]);
    }

    if (modifier > 100) {
        modifier = 100;
    }

    if (currentValue < 5) {
        currentValue = currentValue + Math.abs(regularJiggle());
    } else {
        currentValue = currentValue + modifier + regularJiggle();
    }

    if (currentValue < 0) {
        currentValue = Math.abs(regularJiggle());
    }
    addToTable(myChart, currentValue);
    console.log(currentValue);
}

function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

function calculateDistance(elem, mouseX, mouseY) {
    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left + (elem.width() / 2)), 2) + Math.pow(mouseY - (elem.offset().top + (elem.height() / 2)), 2)));
}

function regularJiggle() {
    return Math.ceil(Math.random() * 5) * (Math.round(Math.random()) ? 1 : -1)
}

function addToTable(myChart, price) {
    const data = myChart.data;
    if (data.datasets.length > 0) {
        //data.labels.push('');
        if (data.labels.length < 100) {
            data.labels.push('');
        }

        
        if (data.datasets[0].data.length > 99) {
            data.datasets[0].data.shift();
        }
        data.datasets[0].data.push(price);

        console.log(data.labels.length, data.datasets[0].data.length)

        myChart.update();
    }
}