using System;
using System.Collections.Generic;

#nullable disable

namespace LogPeople.Domains
{
    public partial class Tipo
    {
        public Tipo()
        {
            Usuarios = new HashSet<Usuario>();
        }

        public byte IdTipo { get; set; }
        public string Tipo1 { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
