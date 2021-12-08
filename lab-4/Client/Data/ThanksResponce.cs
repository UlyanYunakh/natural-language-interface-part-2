using System.Collections.Generic;

namespace Client.Data
{
    public class ThanksResponce : IResponce
    {
        public List<string> KeyWords { get; set; }

        public ThanksResponce()
        {
            KeyWords = new List<string>();
        }

        public string GetResponce(string request)
        {
            foreach (string word in KeyWords)
                if (request.IndexOf(word) != -1)
                    return char.ConvertFromUtf32(0x1F609);
            return null;
        }
    }
}