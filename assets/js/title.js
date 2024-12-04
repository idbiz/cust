const user = {
    name: 'Testirex',
    role: 'Customer',
}

function setTitle(user) {
    if (user.role === 'Customer') {
        document.title = `${user.name} - id.biz.id`;
    } else {
        document.title = 'id.biz.id';
    }
}

setTitle(user);