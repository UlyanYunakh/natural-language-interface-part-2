using System.Collections.Generic;

namespace Client.Data
{
    public interface IResponce
    {
        public List<string> KeyWords { get; set; }
        public string GetResponce(string request);
    }
}