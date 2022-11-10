// Fake Data
const account1 = {
  owner: 'Person 1',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1,
  movementsDates: [
    "2022-10-15T14:18:46.235Z",
    "2022-10-26T18:49:59.371Z",
    "2022-11-01T13:15:33.035Z",
    "2022-11-01T09:48:16.867Z",
    "2022-11-02T12:01:20.894Z",
    "2022-11-03T06:04:23.907Z",
    "2022-11-04T16:33:06.386Z",
    "2022-11-05T14:43:26.374Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account2 = {
  owner: 'Person 2',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2,
  movementsDates: [
    "2022-10-15T14:18:46.235Z",
    "2022-10-26T18:49:59.371Z",
    "2022-11-01T13:15:33.035Z",
    "2022-11-01T09:48:16.867Z",
    "2022-11-02T12:01:20.894Z",
    "2022-11-03T06:04:23.907Z",
    "2022-11-04T16:33:06.386Z",
    "2022-11-05T14:43:26.374Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: 'Person 3',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3,
  movementsDates: [
    "2022-10-15T14:18:46.235Z",
    "2022-10-26T18:49:59.371Z",
    "2022-11-01T13:15:33.035Z",
    "2022-11-01T09:48:16.867Z",
    "2022-11-02T12:01:20.894Z",
    "2022-11-03T06:04:23.907Z",
    "2022-11-04T16:33:06.386Z",
    "2022-11-05T14:43:26.374Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: 'Person 4',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4,
  movementsDates: [
    "2022-01-15T14:18:46.235Z",
    "2022-10-25T06:04:23.907Z",
    "2022-11-05T09:48:16.867Z",
    "2022-11-08T13:15:33.035Z",
    "2022-11-01T16:33:06.386Z"
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = (date, locale) => {
  const calcDayPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000*60*60*24));
  const daysPassed = calcDayPassed(new Date(), date)
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  const isSorted = sort ? acc.slice().sort((a, b) => a - b) : acc.movements;
  isSorted.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  })
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}

const calcDisplaySummary = (acc) => {
  const inComes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(inComes, acc.locale, acc.currency);

  const outComes = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(outComes), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate)/100).filter((int) => int >= 1).reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

const createUsername = (listAccount) => {
  listAccount.forEach((account) => account.username = account.owner.toLowerCase().split(' ').map((char) => char[0]).join(''));
}

createUsername(accounts);

const updateUI = (acc) => {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
}

const startLogOutTimer = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer); 
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  }
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

let currentAcc, timer;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAcc?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${currentAcc.owner.split(' ')[1]}`;
    containerApp.style.opacity = 100;
  };

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };
  labelDate.textContent = new Intl.DateTimeFormat(currentAcc.locale, options).format(now);

  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();

  updateUI(currentAcc);
})

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  if (amount > 0 && receiverAcc && currentAcc.balance >= amount && receiverAcc?.username !== currentAcc.username) {
    currentAcc.movements.push(-amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
})

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAcc.movements.push(amount);
      currentAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAcc);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (inputCloseUsername.value === currentAcc.username && +inputClosePin.value === currentAcc.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAcc.username);
    accounts.splice(index, 1);
    labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAcc.movements, !sorted);
  sorted = !sorted;

})