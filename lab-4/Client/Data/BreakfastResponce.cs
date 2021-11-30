using System;
using System.Collections.Generic;

namespace Client.Data
{
    public class BreakfastResponce : IResponce
    {
        public List<string> KeyWords { get; set; }

        private List<string> _ideas;

        public BreakfastResponce()
        {
            KeyWords = new List<string>();
            _ideas = new List<string>()
            {
                "Приготовьте кашу с бананами и шоколадом.",
                "Аппетитные, нежные и румяные яичные конвертики с ветчиной и сыром.",
                "Простые в приготовлении и необычные на вид горячие бутерброды с начинкой из колбасы и яйца - находка для быстрого перекуса или питательного завтрака."
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
            string idea = "Идея для затрака: ";
            Random rnd = new Random();
            int index = (int)rnd.Next(0,_ideas.Count - 1);
            idea += _ideas[index];
            return idea;
        }
    }
}