let newLogout = new LogoutButton();

newLogout.action = () => {
    let callback = (response) => {
        if (response.success) {
            location.reload();
        }
    }
    ApiConnector.logout(callback)
}

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response);
    }
});

let rates = new RatesBoard();
let getActualStocks = () => {
    let callback = (response) => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(ApiConnector.getStocks(callback));
        }
    }
}
getActualStocks();
setInterval(getActualStocks(), 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = ({currency, amount}) => {

  const callback = (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, `Счет ${currency} успешно пополнен на ${amount} ${currency}`);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  };

    ApiConnector.addMoney({currency, amount}, callback)
}


moneyManager.conversionMoneyCallback = ({fromCurrency, targetCurrency, fromAmount}) => {
    const callback = (response) => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, `${fromAmount} ${fromCurrency} успешно переведен(ы) в ${targetCurrency}`);
      } else {
        moneyManager.setMessage(response.success, response.error);
      }
    };
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, callback);
  };


moneyManager.sendMoneyCallback = ({to, currency, amount}) => {
    const callback = (response) => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, `Перевод средств успешно осуществлен`);
      } else {
        moneyManager.setMessage(response.success, response.error);
      }
    };
    ApiConnector.transferMoney({to, currency, amount}, callback);
  };


  const favoritesWidget = new FavoritesWidget();

  ApiConnector.getFavorites((response) => { if (response) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
  })


  favoritesWidget.addUserCallback = ({id, name}) => {
    const callback = (response) => {
      if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, `Пользователь ${name} успешно добавлен`);
      } else {
        favoritesWidget.setMessage(response.success, response.error);
      }
    };
    ApiConnector.addUserToFavorites({id, name}, callback);
  };


  favoritesWidget.removeUserCallback = (id) => {
    const callback = (response) => {
      if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, `Пользователь удален`);
      } else {
        favoritesWidget.setMessage(response.success, response.error);
      }
    };
    ApiConnector.removeUserFromFavorites(id, callback);
  }; 
