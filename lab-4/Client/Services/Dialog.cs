using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Client.Data;
using Newtonsoft.Json;

namespace Client.Services
{
    public class DialogService
    {
        private List<IResponce> _modules;

        public DialogService()
        {
            _modules = new List<IResponce>();
            _modules.Add(CreateModule(
                new BreakfastResponce(),
                new List<string>()
                {
                    "завтрак",
                    "утро"
                }));
            _modules.Add(CreateModule(
                new LunchResponce(),
                new List<string>()
                {
                    "обед",
                    "середина"
                }));
            _modules.Add(CreateModule(
                new DinnerResponce(),
                new List<string>()
                {
                    "ужин",
                    "вечер"
                }));
            _modules.Add(CreateModule(
                new MealResponce(),
                new List<string>()
                {
                    "кушать",
                    "голод"
                }));
            _modules.Add(CreateModule(
                new HelloResponce(),
                new List<string>()
                {
                    "привет"
                }));
            _modules.Add(CreateModule(
                new ThanksResponce(),
                new List<string>()
                {
                    "спасибо"
                }));
        }

        private IResponce CreateModule(IResponce module, List<string> KeyWords)
        {
            List<string> keyWords = new List<string>();
            foreach (string word in KeyWords)
                keyWords = keyWords.Union(PostToPythonServer(word)).ToList();
            module.KeyWords = keyWords;
            return module;
        }

        private record RequestModel
        {
            public string Text { get; set; }
        }

        private List<string> PostToPythonServer(string text)
        {
            List<string> responceModel = new List<string>();
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri("http://localhost:8080/");
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "relativeAddress");

                string jsonRequest = JsonConvert.SerializeObject(new RequestModel() { Text = text });
                request.Content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


                var responce = client.Send(request);

                byte[] responceByte = responce.Content.ReadAsByteArrayAsync().Result;
                string json = Encoding.UTF8.GetString(responceByte);
                responceModel = JsonConvert.DeserializeObject<List<string>>(json);

                return responceModel;
            }
            catch
            {
                return responceModel;
            }
        }


        public async Task<string> GetResponce(string request)
        {
            if (request != "") {
                request = request.ToLower();
                foreach (IResponce module in _modules)
                {
                    string responce = await Task.FromResult(module.GetResponce(request));
                    if (responce != null)
                        return responce;
                }
            }
            return null;
        }
    }
}