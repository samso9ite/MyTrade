import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string;
  userId: string;
  httpOptions: any;
  adminHttpOptions: any;
  adminId: string;
  paystackBaseUrl: string;

  constructor(private http: HttpClient) {
    this.userId = localStorage.getItem('uui');
    this.adminId = localStorage.getItem('puui');

    environment.production
      ? (this.baseUrl = 'https://mytrade.ng/api/v1')
      : // : (this.baseUrl = 'https://mytrade-app.herokuapp.com/api/v1');
        (this.baseUrl = 'http://localhost:8080/api/v1');

    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin': '*',
        ...(this.userId && { Authorization: `Bearer ${this.userId}` })
      })
    };

    this.adminHttpOptions = {
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin': '*',
        ...(this.adminId && { Authorization: `Bearer ${this.adminId}` })
      })
    };

    this.paystackBaseUrl = 'https://api.paystack.co/bank';
  }

  getCountries(): Observable<object> {
    return this.http.get('./../../assets/json/countries.json');
  }

  login(obj): Observable<object> {
    return this.http.post(`${this.baseUrl}/user/login`, obj, this.httpOptions);
  }

  register(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/user/register`, obj, this.httpOptions);
  }

  verifyEmailToken(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/confirmation`, obj, this.httpOptions);
  }

  resendEmailToken(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/resend`, obj, this.httpOptions);
  }

  forgotPassword(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/forgot_password`, obj, this.httpOptions);
  }

  resetPassword(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/reset_password`, obj, this.httpOptions);
  }

  getUserInfo(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/user/get_info`, this.httpOptions);
  }

  changeUserImage(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/user/image/add`, obj, this.httpOptions);
  }

  addAccountInfo(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/user/account/add`, obj, this.httpOptions);
  }

  selectAccountAsActive(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/user/account/activate`, obj, this.httpOptions);
  }

  deleteAccount(accountId: string): Observable<ArrayBuffer> {
    return this.http.delete(`${this.baseUrl}/user/account/delete/${accountId}`, this.httpOptions);
  }

  getAllAvailableCards(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/card/available/all`, this.httpOptions);
  }

  sellCard(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/user/card/sell`, obj, this.httpOptions);
  }

  getCardDetails(id: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/card/${id}`, this.httpOptions);
  }

  getCardRates(id: string, country: string, type: string): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/card/details?id=${id}&country=${country}&type=${type}`, this.httpOptions);
  }

  // Paystack Endpoints
  getBanks(): Observable<any> {
    return this.http.get(`${this.paystackBaseUrl}?currency=NGN`);
  }

  resolveAccountNumber(obj: { account_number: string; bank_code: string }): Observable<any> {
    return this.http.get(
      `${this.paystackBaseUrl}/resolve?account_number=${obj.account_number}&bank_code=${obj.bank_code}`,
      {
        headers: {
          Authorization: `Bearer sk_test_a44eabb76f93889df68d1b1d71892f8ef01fb3d7`
        }
      }
    );
  }

  // admin routes
  adminLogin(obj): Observable<object> {
    return this.http.post(`${this.baseUrl}/admin/login`, obj);
  }

  getAllUsers(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/user/all`, this.adminHttpOptions);
  }

  addCard(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/add_card`, obj, this.adminHttpOptions);
  }

  addRateToCard(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/card/ratings/add`, obj, this.adminHttpOptions);
  }

  editCard(card_id, obj): Observable<ArrayBuffer> {
    return this.http.put(`${this.baseUrl}/admin/card/${card_id}`, obj, this.adminHttpOptions);
  }

  editCardRating(rate_id, obj): Observable<ArrayBuffer> {
    return this.http.put(`${this.baseUrl}/admin/rating/${rate_id}`, obj, this.adminHttpOptions);
  }

  deleteCard(card_id): Observable<ArrayBuffer> {
    return this.http.delete(`${this.baseUrl}/admin/card/${card_id}`, this.adminHttpOptions);
  }

  deleteCardRate(rate_id): Observable<ArrayBuffer> {
    return this.http.delete(`${this.baseUrl}/admin/rating/${rate_id}`, this.adminHttpOptions);
  }

  freezeCard(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/card/freeze`, obj, this.adminHttpOptions);
  }

  makeCardSellable(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/card/sell`, obj, this.adminHttpOptions);
  }

  enableRateSales(id): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/rate/sell/${id}`, {}, this.adminHttpOptions);
  }

  disableRateSales(id, obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/rate/disable/${id}`, obj, this.adminHttpOptions);
  }

  approveCardTransaction(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/card/transaction/approve`, obj, this.adminHttpOptions);
  }

  declineCardTransaction(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/card/transaction/decline`, obj, this.adminHttpOptions);
  }

  payoutCardTransaction(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/admin/card/transaction/payout`, obj, this.adminHttpOptions);
  }

  getPendingTransactions(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/admin/transactions/pending`, this.adminHttpOptions);
  }

  getApprovedTransactions(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/admin/transactions/approved`, this.adminHttpOptions);
  }

  getPaidTransactions(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/admin/transactions/paid`, this.adminHttpOptions);
  }

  getAllCards(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/card/all`, this.adminHttpOptions);
  }

  getAllCardTransactions(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}//card_transaction/all`, this.httpOptions);
  }

  getAllFeedbacks(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/feedback`, this.adminHttpOptions);
  }

  postFeedback(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/feedback`, obj, this.httpOptions);
  }

  toggleFeedbackState(obj): Observable<ArrayBuffer> {
    return this.http.post(`${this.baseUrl}/feedback/toggle`, obj, this.adminHttpOptions);
  }

  getHomepageFeedbacks(): Observable<ArrayBuffer> {
    return this.http.get(`${this.baseUrl}/feedback/homepage`, this.adminHttpOptions);
  }
}
