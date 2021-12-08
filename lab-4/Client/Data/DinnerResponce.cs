using System;
using System.Collections.Generic;

namespace Client.Data
{
    public class DinnerResponce : IResponce
    {
        public List<string> KeyWords { get; set; }

        private List<string> _ideas;

        public DinnerResponce()
        {
            KeyWords = new List<string>();
            _ideas = new List<string>()
            {
                "Для случаев, когда нет времени или настроения стоять у плиты, отличным вариантом обеда или ужина станет запечённый картофель с сосисками и помидорами под сырной корочкой.",
                "Очень популярную закуску - жульен (или точнее жюльен) с курицей и грибами, можно приготовить на сковороде, примерно за полчаса, совершенно не напрягая себя приобретением кокотниц и доведением блюда до готовности в духовке.",
                "Макароны с томатным соусом - довольно популярное блюдо, которое подают в качестве гарнира."
            };
        }

        public string GetResponce(string request)
        {
            foreach (string word in KeyWords)
                if (request.IndexOf(word) != -1)
                    return GetIdea();
            return null;
        }

        private string GetIdea()
        {
            string idea = "Идея для ужина: ";
            Random rnd = new Random();
            int index = (int)rnd.Next(0,_ideas.Count - 1);
            idea += _ideas[index];
            return idea;
        }
    }
}