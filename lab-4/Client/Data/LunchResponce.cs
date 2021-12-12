using System;
using System.Collections.Generic;

namespace Client.Data
{
    public class LunchResponce : IResponce
    {
        public List<string> KeyWords { get; set; }

        private List<string> _ideas;

        public LunchResponce()
        {
            KeyWords = new List<string>();
            _ideas = new List<string>()
            {
                "Рецепт очень вкусного блюда на обед - лагман с сочным куриным филе. Лагман с курицей покорит сердце любого мужчины.",
                "Картошка в духовке, запёченная по этому рецепту, подойдёт как основное блюдо и как гарнир.",
                "Картофель с мясом, луком и морковью - самое популярное и самое народное блюдо, которым можно вкусно и сытно накормить и семью, и гостей."
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
            string idea = "Идея для обеда: ";
            Random rnd = new Random();
            int index = (int)rnd.Next(0,_ideas.Count - 1);
            idea += _ideas[index];
            return idea;
        }
    }
}