using System.Collections.Generic;

namespace Client.Data
{
    public class HelloResponce : IResponce
    {
        public List<string> KeyWords { get; set; }

        public HelloResponce()
        {
            KeyWords = new List<string>();
        }

        public string GetResponce(string request)
        {
            foreach (string word in KeyWords)
                if (request.IndexOf(word) != -1)
                    return "Здравствуйте";
            return null;
        }
    }
}